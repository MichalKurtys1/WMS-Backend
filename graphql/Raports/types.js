export const types = `
scalar JSON

  type GeneralRaport {
    weekData: JSON!
    monthData: JSON!
    yearData: JSON!
  }

  type DeliveriesRaport {
    weekData: JSON!
    monthData: JSON!
    yearData: JSON!
  }

  type OrdersRaport {
    weekData: JSON!
    monthData: JSON!
    yearData: JSON!
  }

  type StockRaport {
    generalData: JSON!
    operationsData: JSON!
    weekData: JSON!
    monthData: JSON!
    yearData: JSON!
  }
  
  type DashboardReport {
    dashboardData: JSON!
  }
  
`;
