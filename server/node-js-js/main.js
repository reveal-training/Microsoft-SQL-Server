var express = require('express');
var reveal = require('reveal-sdk-node');
var cors = require('cors');
//const { RVPostgresDataSourceItem } = require('reveal-sdk-node');

const app = express();

app.use(cors()); // DEVELOPMENT only! In production, configure appropriately.

const authenticationProvider = async (userContext, dataSource) => {
  console.log("Enter Authentication Provider");
 
    if (dataSource instanceof reveal.RVSqlServerDataSource) {
      return new reveal.RVUsernamePasswordDataSourceCredential("username", "password"); }
  }


// Change your DATABASE & HOST 
const dataSourceProvider = async (userContext, dataSource) => {
  if (dataSource instanceof reveal.RVSqlServerDataSource) {
        dataSource.host = ".infragistics.local";
        dataSource.database = "Northwind";
  }
  return dataSource;
}

const dataSourceItemProvider = async (userContext, dataSourceItem) => {
  console.log("Enter dataSourceItemProvider");
  
  // SQL Server
  if (dataSourceItem instanceof reveal.RVSqlServerDataSourceItem) {

    console.log("in SQL Server dataSourceItem");  
    // This Database property needed for both SQL Express and SQL Server
    // Change to the correct database name
    dataSourceItem.database = "Northwind";            

        if (dataSourceItem.id == "CustOrderHist")
        {
            dataSourceItem.procedure = "CustOrderHist";
            dataSourceItem.procedureParameters = {"@CustomerID": 'ALFKI'};  //userContext.UserId
        }

        if (dataSourceItem.id == "CustOrdersOrders")
        {
            dataSourceItem.procedure = "CustOrdersOrders";
            dataSourceItem.procedureParameters = {"@CustomerID": 'ALFKI'};  //userContext.UserId
        }

        if (dataSourceItem.id == "TenMostExpensiveProducts")
        {
            dataSourceItem.procedure = "Ten Most Expensive Products";
        }

        if (dataSourceItem.id == "CustomerOrders")
        {
            dataSourceItem.customQuery = "Select * from Orders";    
        }
    }
 
    return dataSourceItem;
  }

const revealOptions = {
    authenticationProvider: authenticationProvider,
    dataSourceProvider: dataSourceProvider,
    dataSourceItemProvider: dataSourceItemProvider,
    localFileStoragePath: "data"
}

//add reveal sdk
app.use('/', reveal(revealOptions));

app.listen(5111, () => {
    console.log(`Reveal server accepting http requests`);
});
