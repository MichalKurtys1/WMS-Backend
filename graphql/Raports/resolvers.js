import { ApolloError } from "apollo-server-express";
import Product from "../../models/product";
import Supplier from "../../models/supplier";
import { authCheck } from "../../utils/authCheck";
import Stock from "../../models/stock";
import Orders from "../../models/orders";
import Deliveries from "../../models/deliveries";
import Shipments from "../../models/shipments";
import Client from "../../models/client";
import chroma from "chroma-js";

// generlaReports

const generalRaportsWeek = async () => {
  const currentDate = new Date();
  const daysOfWeek = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];
  const dayNumbers = [];
  let totalIncome = 0;
  let totalExpenses = 0;

  for (let i = 0; i < 7; i++) {
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - i);
    const dayNumber = previousDate.getDay();
    dayNumbers.push({
      dayName: daysOfWeek[dayNumber],
      date: previousDate.toISOString().split("T")[0],
    });
  }
  const initialData = dayNumbers.reverse().map((day) => ({
    x: day.dayName,
    Przychody: 0,
    Wydatki: 0,
    z: day.date,
  }));

  const orders = await Orders.findAll();
  orders.forEach((order) => {
    if (order.state === "Zakończono") {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      const matchingDataPoint = initialData.find(
        (dataPoint) => dataPoint.z === orderDate
      );

      if (matchingDataPoint) {
        totalIncome += order.totalPrice;
        matchingDataPoint.Przychody += +order.totalPrice.toFixed(0);
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((deliveries) => {
    if (deliveries.state === "Zakończono") {
      const orderDate = new Date(+deliveries.date).toISOString().split("T")[0];
      const matchingDataPoint = initialData.find(
        (dataPoint) => dataPoint.z === orderDate
      );

      if (matchingDataPoint) {
        totalExpenses += deliveries.totalPrice;
        matchingDataPoint.Wydatki += +deliveries.totalPrice.toFixed(0);
      }
    }
  });

  return {
    data: initialData,
    income: totalIncome.toFixed(0),
    expenses: totalExpenses.toFixed(0),
    bilans: (totalIncome - totalExpenses).toFixed(0),
  };
};

const generalRaportsMonth = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const dataArray = [];
  let totalIncome = 0;
  let totalExpenses = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    dataArray.push({
      x: formattedDate,
      Przychody: 0,
      Wydatki: 0,
    });
  }
  const orders = await Orders.findAll();
  orders.forEach((order) => {
    if (order.state === "Zakończono") {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      const matchingDataPoint = dataArray.find(
        (dataPoint) => dataPoint.x === orderDate
      );
      if (matchingDataPoint) {
        totalIncome += order.totalPrice;
        matchingDataPoint.Przychody += +order.totalPrice.toFixed(0);
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((deliveries) => {
    if (deliveries.state === "Zakończono") {
      const deliveriesDate = new Date(+deliveries.date)
        .toISOString()
        .split("T")[0];
      const matchingDataPoint = dataArray.find(
        (dataPoint) => dataPoint.x === deliveriesDate
      );
      if (matchingDataPoint) {
        totalExpenses += deliveries.totalPrice;
        matchingDataPoint.Wydatki += +deliveries.totalPrice.toFixed(0);
      }
    }
  });

  return {
    data: dataArray,
    income: totalIncome.toFixed(0),
    expenses: totalExpenses.toFixed(0),
    bilans: (totalIncome - totalExpenses).toFixed(0),
  };
};

const generalRaportsYear = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = [];
  let totalIncome = 0;
  let totalExpenses = 0;

  for (let month = 0; month < 12; month++) {
    months.push({
      x: `${currentYear}-${month + 1 < 10 ? "0" : ""}${month + 1}`,
      Przychody: 0,
      Wydatki: 0,
    });
  }

  const orders = await Orders.findAll();
  orders.forEach((order) => {
    if (order.state === "Zakończono") {
      const orderDate = new Date(+order.date).toISOString().slice(0, 7);
      const matchingDataPoint = months.find(
        (dataPoint) => dataPoint.x === orderDate
      );
      if (matchingDataPoint) {
        totalIncome += order.totalPrice;
        matchingDataPoint.Przychody += +order.totalPrice.toFixed(0);
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((deliveries) => {
    if (deliveries.state === "Zakończono") {
      const deliveriesDate = new Date(+deliveries.date)
        .toISOString()
        .slice(0, 7);
      const matchingDataPoint = months.find(
        (dataPoint) => dataPoint.x === deliveriesDate
      );
      if (matchingDataPoint) {
        totalExpenses += deliveries.totalPrice;
        matchingDataPoint.Wydatki += +deliveries.totalPrice.toFixed(0);
      }
    }
  });

  return {
    data: months,
    income: totalIncome.toFixed(0),
    expenses: totalExpenses.toFixed(0),
    bilans: (totalIncome - totalExpenses).toFixed(0),
  };
};

// deliveriesReports

const deliveriesRaportWeek = async () => {
  const currentDate = new Date();
  const daysOfWeek = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];
  const dayNumbers = [];
  const suppliers = await Supplier.findAll();
  let results = suppliers.map((item) => {
    return { suppliers: item.name };
  });

  for (let i = 0; i < 7; i++) {
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - i);
    const dayNumber = previousDate.getDay();
    dayNumbers.push({
      dayName: daysOfWeek[dayNumber],
      date: previousDate.toISOString().split("T")[0],
    });
  }
  const initialData = dayNumbers.reverse().map((day) => ({
    x: day.dayName,
    y: 0,
    z: day.date,
    v: 0,
  }));

  let sum = 0;
  let avg = 0;
  let earned = 0;

  const deliveries = await Deliveries.findAll({
    include: Supplier,
  });

  deliveries.forEach((order) => {
    const orderDate = new Date(+order.date).toISOString().split("T")[0];
    const matchingDataPoint = initialData.find(
      (dataPoint) => dataPoint.z === orderDate
    );

    if (matchingDataPoint) {
      const prods = JSON.parse(JSON.parse(order.products));
      const res = results.find(
        (item) => item.suppliers === order.supplier.name
      );

      prods.forEach((element) => {
        if (res[element.product]) {
          res[element.product] += +element.quantity;
        } else {
          res[element.product] = +element.quantity;
        }
        avg += +element.quantity;
      });

      earned += order.totalPrice;
      matchingDataPoint.y += 1;
      matchingDataPoint.v += +order.totalPrice.toFixed(0);
      sum++;
    }
  });

  return {
    clientResults: results,
    ordersResults: [{ id: "orders", data: initialData }],
    sum: sum,
    avg: (avg / sum).toFixed(0),
    earned: earned.toFixed(0),
  };
};

const deliveriesRaportMonth = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const dataArray = [];
  const suppliers = await Supplier.findAll();
  let results = suppliers.map((item) => {
    return { suppliers: item.name };
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    dataArray.push({
      x: formattedDate,
      y: 0,
      v: 0,
    });
  }

  let sum = 0;
  let avg = 0;
  let earned = 0;

  const deliveries = await Deliveries.findAll({
    include: Supplier,
  });

  deliveries.forEach((order) => {
    const orderDate = new Date(+order.date).toISOString().split("T")[0];
    const matchingDataPoint = dataArray.find(
      (dataPoint) => dataPoint.x === orderDate
    );

    if (matchingDataPoint) {
      const prods = JSON.parse(JSON.parse(order.products));
      const res = results.find(
        (item) => item.suppliers === order.supplier.name
      );

      prods.forEach((element) => {
        if (res[element.product]) {
          res[element.product] += +element.quantity;
        } else {
          res[element.product] = +element.quantity;
        }
        avg += +element.quantity;
      });

      earned += order.totalPrice;
      matchingDataPoint.y += 1;
      matchingDataPoint.v += +order.totalPrice.toFixed(0);
      sum++;
    }
  });

  return {
    clientResults: results,
    ordersResults: [{ id: "orders", data: dataArray }],
    sum: sum,
    avg: (avg / sum).toFixed(0),
    earned: earned.toFixed(0),
  };
};

const deliveriesRaportYear = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = [];
  const suppliers = await Supplier.findAll();
  let results = suppliers.map((item) => {
    return { suppliers: item.name };
  });

  for (let month = 0; month < 12; month++) {
    months.push({
      x: `${currentYear}-${month + 1 < 10 ? "0" : ""}${month + 1}`,
      y: 0,
      v: 0,
    });
  }

  let sum = 0;
  let avg = 0;
  let earned = 0;

  const deliveries = await Deliveries.findAll({
    include: Supplier,
  });

  deliveries.forEach((order) => {
    const orderDate = new Date(+order.date).toISOString().slice(0, 7);
    const matchingDataPoint = months.find(
      (dataPoint) => dataPoint.x === orderDate
    );

    if (matchingDataPoint) {
      const prods = JSON.parse(JSON.parse(order.products));
      const res = results.find(
        (item) => item.suppliers === order.supplier.name
      );

      prods.forEach((element) => {
        if (res[element.product]) {
          res[element.product] += +element.quantity;
        } else {
          res[element.product] = +element.quantity;
        }
        avg += +element.quantity;
      });

      earned += order.totalPrice;
      matchingDataPoint.y += 1;
      matchingDataPoint.v += +order.totalPrice.toFixed(0);
      sum++;
    }
  });

  return {
    clientResults: results,
    ordersResults: [{ id: "orders", data: months }],
    sum: sum,
    avg: (avg / sum).toFixed(0),
    earned: earned.toFixed(0),
  };
};

// ordersRaports

const ordersRaportWeek = async () => {
  const currentDate = new Date();
  const daysOfWeek = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];
  const dayNumbers = [];

  const client = await Client.findAll();
  let results = client.map((item) => {
    return { client: item.name };
  });

  for (let i = 0; i < 7; i++) {
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - i);
    const dayNumber = previousDate.getDay();
    dayNumbers.push({
      dayName: daysOfWeek[dayNumber],
      date: previousDate.toISOString().split("T")[0],
    });
  }
  const initialData = dayNumbers.reverse().map((day) => ({
    x: day.dayName,
    y: 0,
    z: day.date,
    v: 0,
  }));

  let sum = 0;
  let avg = 0;
  let earned = 0;

  const orders = await Orders.findAll({
    include: Client,
  });

  orders.forEach((order) => {
    const orderDate = new Date(+order.date).toISOString().split("T")[0];
    const matchingDataPoint = initialData.find(
      (dataPoint) => dataPoint.z === orderDate
    );

    if (matchingDataPoint) {
      const prods = JSON.parse(JSON.parse(order.products));
      const res = results.find((item) => item.client === order.client.name);
      prods.forEach((element) => {
        if (res[element.product]) {
          res[element.product] += +element.quantity;
        } else {
          res[element.product] = +element.quantity;
        }
        avg += +element.quantity;
      });
      earned += order.totalPrice;
      matchingDataPoint.y += 1;
      matchingDataPoint.v += +order.totalPrice.toFixed(0);
      sum++;
    }
  });

  return {
    clientResults: results,
    ordersResults: [{ id: "orders", data: initialData }],
    sum: sum,
    avg: (avg / sum).toFixed(0),
    earned: earned.toFixed(0),
  };
};

const ordersRaportMonth = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const dataArray = [];

  const client = await Client.findAll();
  let results = client.map((item) => {
    return { client: item.name };
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    dataArray.push({
      x: formattedDate,
      y: 0,
      v: 0,
    });
  }

  let sum = 0;
  let avg = 0;
  let earned = 0;

  const orders = await Orders.findAll({
    include: Client,
  });

  orders.forEach((order) => {
    const orderDate = new Date(+order.date).toISOString().split("T")[0];
    const matchingDataPoint = dataArray.find(
      (dataPoint) => dataPoint.x === orderDate
    );

    if (matchingDataPoint) {
      const prods = JSON.parse(JSON.parse(order.products));
      const res = results.find((item) => item.client === order.client.name);
      prods.forEach((element) => {
        if (res[element.product]) {
          res[element.product] += +element.quantity;
        } else {
          res[element.product] = +element.quantity;
        }
        avg += +element.quantity;
      });
      earned += order.totalPrice;
      matchingDataPoint.y += 1;
      matchingDataPoint.v += +order.totalPrice.toFixed(0);
      sum++;
    }
  });

  return {
    clientResults: results,
    ordersResults: [{ id: "orders", data: dataArray }],
    sum: sum,
    avg: (avg / sum).toFixed(0),
    earned: earned.toFixed(0),
  };
};

const ordersRaportYear = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = [];

  const client = await Client.findAll();
  let results = client.map((item) => {
    return { client: item.name };
  });

  for (let month = 0; month < 12; month++) {
    months.push({
      x: `${currentYear}-${month + 1 < 10 ? "0" : ""}${month + 1}`,
      y: 0,
      v: 0,
    });
  }

  let sum = 0;
  let avg = 0;
  let earned = 0;

  const orders = await Orders.findAll({
    include: Client,
  });

  orders.forEach((order) => {
    const orderDate = new Date(+order.date).toISOString().slice(0, 7);
    const matchingDataPoint = months.find(
      (dataPoint) => dataPoint.x === orderDate
    );

    if (matchingDataPoint) {
      const prods = JSON.parse(JSON.parse(order.products));
      const res = results.find((item) => item.client === order.client.name);
      prods.forEach((element) => {
        if (res[element.product]) {
          res[element.product] += +element.quantity;
        } else {
          res[element.product] = +element.quantity;
        }
        avg += +element.quantity;
      });
      earned += order.totalPrice;
      matchingDataPoint.y += 1;
      matchingDataPoint.v += +order.totalPrice.toFixed(0);
      sum++;
    }
  });

  return {
    clientResults: results,
    ordersResults: [{ id: "orders", data: months }],
    sum: sum,
    avg: (avg / sum).toFixed(0),
    earned: earned.toFixed(0),
  };
};

// stockRaports

const stockRaportGeneral = async () => {
  const stock = await Stock.findAll({
    include: Product,
  });
  const results = stock.map((item, i) => {
    let scale = chroma.scale(["#E5EAFF", "#B2C1FF", "#8097FF", "#3054F2"]);
    const randomColor = scale(i * 0.15).hex();
    const productName =
      item.product.name +
      " " +
      item.product.type +
      " " +
      item.product.capacity +
      " ";
    const objects = [
      {
        id: productName,
        value: item.totalQuantity,
        idColor: randomColor,
      },
      {
        id: productName + "- Dostępne",
        value: item.availableStock,
        idColor: randomColor,
      },
      {
        id: productName + "- Zamówione",
        value: item.ordered,
        idColor: randomColor,
      },
    ];
    return objects;
  });

  return results.flat(1);
};

const stockRaportOperations = async () => {
  let tempData = {
    startedOrders: 0,
    startedDeliveries: 0,
    duringOrders: 0,
    duringDeliveries: 0,
    finishedOrders: 0,
    finishedDeliveries: 0,
  };
  const orders = await Orders.findAll();
  orders.forEach((element) => {
    if (element.state === "Zamówiono" || element.state === "Pre Order") {
      tempData.startedOrders += 1;
    } else if (element.state === "Zakończono") {
      tempData.finishedOrders += 1;
    } else {
      tempData.duringOrders += 1;
    }
  });
  const deliveries = await Deliveries.findAll();
  deliveries.forEach((element) => {
    if (element.state === "Zamówiono") {
      tempData.startedDeliveries += 1;
    } else if (element.state === "Zakończono") {
      tempData.finishedDeliveries += 1;
    } else {
      tempData.duringDeliveries += 1;
    }
  });

  return tempData;
};

const stockRaportWeek = async () => {
  const stock = await Stock.findAll({
    include: Product,
  });
  let tempData = stock.map((item) => {
    const productName =
      item.product.name + " " + item.product.type + " " + item.product.capacity;
    return {
      product: productName,
      Dostarczone: 0,
      Wysłane: 0,
      Bilans: 0,
    };
  });

  let currentDate = new Date();
  let sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const orders = await Orders.findAll();
  orders.forEach((element) => {
    const products = JSON.parse(JSON.parse(element.products));
    let orderDate;
    if (element.state === "Zakończono") {
      orderDate = new Date(+element.date);
      if (orderDate >= sevenDaysAgo && orderDate <= currentDate) {
        products.forEach((item) => {
          const foundStock = tempData.find(
            (stock) => stock.product === item.product
          );
          if (foundStock) {
            foundStock.Wysłane += +item.quantity;
          }
        });
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((element) => {
    const products = JSON.parse(JSON.parse(element.products));
    let deliveryDate;
    if (element.state === "Zakończono") {
      deliveryDate = new Date(+element.date);
      if (deliveryDate >= sevenDaysAgo && deliveryDate <= currentDate) {
        products.forEach((item) => {
          const foundStock = tempData.find(
            (stock) => stock.product === item.product
          );
          if (foundStock) {
            foundStock.Dostarczone += +item.quantity;
          }
        });
      }
    }
  });

  return tempData.map((item) => {
    return {
      ...item,
      Bilans: item.Dostarczone - item.Wysłane,
    };
  });
};

const stockRaportMonth = async () => {
  const stock = await Stock.findAll({
    include: Product,
  });
  let tempData = stock.map((item) => {
    const productName =
      item.product.name + " " + item.product.type + " " + item.product.capacity;
    return {
      product: productName,
      Dostarczone: 0,
      Wysłane: 0,
      Bilans: 0,
    };
  });

  let currentDate = new Date().getMonth() + 1;

  const orders = await Orders.findAll();
  orders.forEach((element) => {
    const products = JSON.parse(JSON.parse(element.products));
    let orderDate;
    if (element.state === "Zakończono") {
      orderDate = new Date(+element.date).getMonth() + 1;
      if (orderDate === currentDate) {
        products.forEach((item) => {
          const foundStock = tempData.find(
            (stock) => stock.product === item.product
          );
          if (foundStock) {
            foundStock.Wysłane += +item.quantity;
          }
        });
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((element) => {
    const products = JSON.parse(JSON.parse(element.products));
    let deliveryDate;
    if (element.state === "Zakończono") {
      deliveryDate = new Date(+element.date).getMonth() + 1;
      if (deliveryDate === currentDate) {
        products.forEach((item) => {
          const foundStock = tempData.find(
            (stock) => stock.product === item.product
          );
          if (foundStock) {
            foundStock.Dostarczone += +item.quantity;
          }
        });
      }
    }
  });

  return tempData.map((item) => {
    return {
      ...item,
      Bilans: item.Dostarczone - item.Wysłane,
    };
  });
};

const stockRaportYear = async () => {
  const stock = await Stock.findAll({
    include: Product,
  });
  let tempData = stock.map((item) => {
    const productName =
      item.product.name + " " + item.product.type + " " + item.product.capacity;
    return {
      product: productName,
      Dostarczone: 0,
      Wysłane: 0,
      Bilans: 0,
    };
  });

  let currentDate = new Date().getFullYear();

  const orders = await Orders.findAll();
  orders.forEach((element) => {
    const products = JSON.parse(JSON.parse(element.products));
    let orderDate;
    if (element.state === "Zakończono") {
      orderDate = new Date(+element.date).getFullYear();
      if (orderDate === currentDate) {
        products.forEach((item) => {
          const foundStock = tempData.find(
            (stock) => stock.product === item.product
          );
          if (foundStock) {
            foundStock.Wysłane += +item.quantity;
          }
        });
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((element) => {
    const products = JSON.parse(JSON.parse(element.products));
    let deliveryDate;
    if (element.state === "Zakończono") {
      deliveryDate = new Date(+element.date).getFullYear();
      if (deliveryDate === currentDate) {
        products.forEach((item) => {
          const foundStock = tempData.find(
            (stock) => stock.product === item.product
          );
          if (foundStock) {
            foundStock.Dostarczone += +item.quantity;
          }
        });
      }
    }
  });

  return tempData.map((item) => {
    return {
      ...item,
      Bilans: item.Dostarczone - item.Wysłane,
    };
  });
};

// dashboardRaports

const dataCountingHandler = async () => {
  let tempData = {
    started: 0,
    during: 0,
    finished: 0,
    incomming: 0,
    outgoing: 0,
  };

  const orders = await Orders.findAll();
  orders.forEach((element) => {
    const date = +element.expectedDate - 24 * 60 * 60 * 1000;
    const eventTime = new Date(date).toISOString().split("T")[0];
    const tileTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (eventTime === tileTime) {
      const prods = JSON.parse(JSON.parse(element.products));
      prods.forEach((element) => {
        tempData.outgoing += +element.quantity;
      });
      if (element.state === "Zamówiono" || element.state === "Pre Order") {
        tempData.started += 1;
      } else if (element.state === "Zakończono") {
        tempData.finished += 1;
      } else {
        tempData.during += 1;
      }
    }
  });

  const deliveries = await Deliveries.findAll();
  deliveries.forEach((element) => {
    const date = +element.expectedDate - 24 * 60 * 60 * 1000;
    const eventTime = new Date(date).toISOString().split("T")[0];
    const tileTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (eventTime === tileTime) {
      const prods = JSON.parse(JSON.parse(element.products));
      prods.forEach((element) => {
        tempData.incomming += +element.quantity;
      });
      if (element.state === "Zamówiono") {
        tempData.started += 1;
      } else if (element.state === "Zakończono") {
        tempData.finished += 1;
      } else {
        tempData.during += 1;
      }
    }
  });
  return {
    incomming: tempData.incomming,
    outgoing: tempData.outgoing,
    started: tempData.started,
    during: tempData.during,
    finished: tempData.finished,
  };
};

const bilansCountHandler = async () => {
  const currentDate = new Date(new Date().getTime())
    .toISOString()
    .split("T")[0];
  let totalIncome = 0;
  let totalExpenses = 0;

  const orders = await Orders.findAll();
  orders.forEach((order) => {
    if (order.state === "Zakończono") {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      if (orderDate === currentDate) {
        totalIncome += order.totalPrice;
      }
    }
  });
  const deliveries = await Deliveries.findAll();
  deliveries.forEach((deliveries) => {
    if (deliveries.state === "Zakończono") {
      const orderDate = new Date(+deliveries.date).toISOString().split("T")[0];
      if (orderDate === currentDate) {
        totalExpenses += deliveries.totalPrice;
      }
    }
  });
  return {
    income: totalIncome.toFixed(0),
    expenses: totalExpenses.toFixed(0),
    bilans: (totalIncome - totalExpenses).toFixed(0),
  };
};

const queries = {
  generalRaports: async (root, args, context) => {
    try {
      authCheck(context.token);
      const weekData = await generalRaportsWeek();
      const monthData = await generalRaportsMonth();
      const yearData = await generalRaportsYear();

      return {
        weekData: JSON.stringify(weekData),
        monthData: JSON.stringify(monthData),
        yearData: JSON.stringify(yearData),
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  deliveriesRaport: async (root, args, context) => {
    try {
      authCheck(context.token);
      const weekData = await deliveriesRaportWeek();
      const monthData = await deliveriesRaportMonth();
      const yearData = await deliveriesRaportYear();

      return {
        weekData: JSON.stringify(weekData),
        monthData: JSON.stringify(monthData),
        yearData: JSON.stringify(yearData),
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  ordersRaport: async (root, args, context) => {
    try {
      authCheck(context.token);
      const weekData = await ordersRaportWeek();
      const monthData = await ordersRaportMonth();
      const yearData = await ordersRaportYear();

      return {
        weekData: JSON.stringify(weekData),
        monthData: JSON.stringify(monthData),
        yearData: JSON.stringify(yearData),
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  stockRaport: async (root, args, context) => {
    try {
      authCheck(context.token);
      const generalData = await stockRaportGeneral();
      const operationsData = await stockRaportOperations();
      const weekData = await stockRaportWeek();
      const monthData = await stockRaportMonth();
      const yearData = await stockRaportYear();

      return {
        generalData: JSON.stringify(generalData),
        operationsData: JSON.stringify(operationsData),
        weekData: JSON.stringify(weekData),
        monthData: JSON.stringify(monthData),
        yearData: JSON.stringify(yearData),
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  dashboardReport: async (root, args, context) => {
    try {
      authCheck(context.token);
      const bilansData = await bilansCountHandler();
      const countingData = await dataCountingHandler();

      return {
        dashboardData: JSON.stringify({
          started: countingData.started,
          during: countingData.during,
          finished: countingData.finished,
          income: bilansData.income,
          expenses: bilansData.expenses,
          bilans: bilansData.bilans,
          incomming: countingData.incomming,
          outgoing: countingData.outgoing,
        }),
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
