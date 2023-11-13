import { ApolloError } from "apollo-server-express";
import { authCheck } from "../../utils/authCheck";
import dotenv from "dotenv";
import { Storage, File } from "megajs";
import path from "path";
import fs, { createReadStream } from "fs";
import Files from "../../models/files";
import Orders from "../../models/orders";
import Deliveries from "../../models/deliveries";
import shipments from "../../models/shipments";
import Supplier from "../../models/supplier";
import Client from "../../models/client";
import Stock from "../../models/stock";
import Product from "../../models/product";

dotenv.config();
const EMAIL = process.env.MEGA_EMAIL;
const PASSWORD = process.env.MEGA_PASSWORD;

const storageConnection = async () => {
  return new Storage(
    {
      email: EMAIL,
      password: PASSWORD,
      userAgent: "ExampleApplication/1.0",
    },
    (error) => {
      if (error) {
        throw new ApolloError("CLOUD_CONN_ERROR");
      }
    }
  );
};

const uploadFileToCloud = async (filePath) => {
  try {
    const storage = await storageConnection();
    await storage.ready;

    const folder = Object.values(storage.files).find(
      (file) => file.name === "inzynierka"
    );

    const fileStream = createReadStream(filePath);

    const uploadStream = folder.upload({
      name: path.basename(filePath),
      size: (await fs.promises.stat(filePath)).size,
    });
    const promise = await new Promise((resolve, reject) => {
      fileStream.pipe(uploadStream);
      uploadStream.on("complete", (result) => {
        resolve(result);
      });

      uploadStream.on("error", (error) => {
        reject(error);
      });
    });
    const storageValue = await storage;
    storageValue.close();
    return promise;
  } catch (error) {
    throw new ApolloError("FILE_UPLOAD_ERROR");
  }
};

const getFile = async (filename) => {
  try {
    const storage = await storageConnection();
    await storage.ready;

    const folder = Object.values(storage.files).find(
      (file) => file.name === "inzynierka"
    );

    const file = Object.values(folder.children).find(
      (file) => file.name === filename
    );
    await storage.close;
    return await File.fromURL(await file.link()).downloadBuffer();
  } catch (error) {
    throw new ApolloError("GET_FILE_ERROR");
  }
};

const deleteFile = async (filename) => {
  try {
    const storage = await storageConnection();
    await storage.ready;

    const folder = Object.values(storage.files).find(
      (file) => file.name === "inzynierka"
    );

    const file = Object.values(folder.children).find(
      (file) => file.name === filename
    );

    await file.delete();
    await storage.close;
    return;
  } catch (error) {
    throw new ApolloError("GET_FILE_ERROR");
  }
};

const queries = {
  files: async (root, args, context) => {
    authCheck(context.token);

    const files = await Files.findAll().catch((err) => {
      throw new ApolloError(error);
    });

    const newFiles = await Promise.all(
      files.map(async (file) => {
        return {
          id: file.id,
          name: file.name,
          filename: file.filename,
          date: file.date,
          category: file.category,
          subcategory: file.subcategory,
        };
      })
    );

    return newFiles;
  },
};

const mutations = {
  fileUpload: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { file, name, id, date } = args;

      const {
        createReadStream: readStream,
        filename,
        mimetype,
        encoding,
      } = await file;

      if (
        !filename.includes(".pdf") &&
        !filename.includes(".docx") &&
        !filename.includes(".txt")
      ) {
        return;
      }

      const fileExists = await Files.findOne({
        where: {
          filename: filename,
        },
      });

      if (fileExists) {
        throw new ApolloError("FILENAME_TAKEN");
      }

      const delivery = await Deliveries.findByPk(id, {
        include: [Supplier],
      });

      const order = await Orders.findByPk(id, {
        include: [Client],
      });

      const shippment = await shipments.findByPk(id);

      let category;
      let subcategory;

      if (delivery) {
        category = "Dostawy";
        subcategory = delivery.supplier.name;
      } else if (order) {
        category = "Zamówienia";
        subcategory = order.client.name;
      } else if (shippment) {
        category = "Listy Przewozowe";
        subcategory = shippment.employee;
      } else {
        category = "Inne";
        subcategory = "Inne";
      }

      await Files.create({
        name: name,
        filename: filename,
        date: date,
        category: category,
        subcategory: subcategory,
      });

      const stream = readStream();
      const pathName = path.join(`./public/${filename}`);
      const writeStream = fs.createWriteStream(pathName);
      stream.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      await uploadFileToCloud(pathName);
      fs.unlinkSync(pathName);

      if (delivery && delivery.state === "Rozlokowano") {
        await Deliveries.update(
          {
            state: "Zakończono",
          },
          {
            where: {
              id: id,
            },
          }
        );
      } else if (order && order.state === "Do odebrania") {
        let products = JSON.parse(JSON.parse(order.products));
        const stock = await Stock.findAll();

        for (const item of stock) {
          const data = await Product.findByPk(item.productId);
          for (const innerItem of products) {
            if (
              innerItem.product.includes(data.name) &&
              innerItem.product.includes(data.type) &&
              innerItem.product.includes(data.capacity)
            ) {
              const newTotalQuantity =
                parseInt(item.totalQuantity) - parseInt(innerItem.quantity);

              await Stock.update(
                {
                  totalQuantity: newTotalQuantity < 0 ? 0 : newTotalQuantity,
                },
                {
                  where: {
                    id: item.id,
                  },
                }
              );
              await Orders.update(
                { state: "Zakończono" },
                {
                  where: {
                    id: id,
                  },
                }
              );
            }
          }
        }
      }

      console.log("uploaded");

      return true;
    } catch (error) {
      console.log(error);
      throw new ApolloError(error);
    }
  },
  fileDownload: async (root, args, context) => {
    try {
      authCheck(context.token);
      const { filename } = args;

      const file = await getFile(filename);
      const pathName = path.join(`./public/${filename}`);
      await fs.writeFileSync(pathName, file);

      setTimeout(() => {
        fs.unlinkSync(pathName);
      }, 300000);

      return `http://localhost:3001/${filename}`;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  fileDelete: async (root, args, context) => {
    try {
      authCheck(context.token);

      const { filename } = args;

      const file = Files.destroy({
        where: {
          filename: filename,
        },
      });

      deleteFile(filename);

      return true;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

export const resolvers = { queries, mutations };
