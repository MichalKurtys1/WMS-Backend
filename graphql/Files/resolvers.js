import User from "../../models/user";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../models/client";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import dotenv from "dotenv";
import { Storage, File } from "megajs";
import path from "path";
import fs, { createReadStream } from "fs";
import Files from "../../models/files";
import Orders from "../../models/orders";
import Deliveries from "../../models/deliveries";
import OrdersShipments from "../../models/ordersShipments";

// -----
process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
// -----

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
        throw new ApolloError("CLOUD_CONN_ERROR", error);
      } else {
        console.log("gittttt");
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
    (await storage).close;
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
      throw new ApolloError("SERVER_ERROR");
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
    authCheck(context.token);
    const { file, name, id, date } = args;

    const {
      createReadStream: readStream,
      filename,
      mimetype,
      encoding,
    } = await file;

    if (
      mimetype !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      mimetype !== "application/pdf" &&
      mimetype !== "text/plain"
    ) {
      return;
    }

    const fileExists = await Files.findOne({
      where: {
        filename: filename,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    if (fileExists) {
      throw new ApolloError("FILENAME_TAKEN");
    }

    const delivery = await Deliveries.findByPk(id, {
      include: [Supplier],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    const order = await Orders.findByPk(id, {
      include: [Client],
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });
    const shippment = await OrdersShipments.findByPk(id).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

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
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    try {
      const stream = readStream();
      const pathName = path.join(`./storage/${filename}`);
      const writeStream = fs.createWriteStream(pathName);
      stream.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      await uploadFileToCloud(pathName);
      fs.unlinkSync(pathName);
    } catch (error) {
      throw new ApolloError("FILE_UPLOAD_ERROR");
    }

    console.log("file uploaded");
    return true;
  },
  fileDownload: async (root, args, context) => {
    authCheck(context.token);
    const { filename } = args;

    try {
      const file = await getFile(filename);
      const pathName = path.join(`./public/${filename}`);
      await fs.writeFileSync(pathName, file);

      setTimeout(() => {
        fs.unlinkSync(pathName);
      }, 300000);
    } catch (error) {
      throw new ApolloError("FILE_DOWNLOAD_ERROR");
    }
    return `http://localhost:3001/${filename}`;
  },
  fileDelete: async (root, args, context) => {
    authCheck(context.token);
    const { filename } = args;
    const file = Files.destroy({
      where: {
        filename: filename,
      },
    }).catch((err) => {
      throw new ApolloError("SERVER_ERROR");
    });

    deleteFile(filename);

    return true;
  },
};

export const resolvers = { queries, mutations };
