﻿using Reveal.Sdk;

namespace RevealSdk.Server.Reveal
{
    // ****
    // https://help.revealbi.io/web/user-context/ 
    // The User Context is optional, but used in almost every scenario.
    // This accepts the HttpContext from the client, sent using the  $.ig.RevealSdkSettings.setAdditionalHeadersProvider(function (url).
    // UserContext is an object that can include the identity of the authenticated user of the application,
    // as well as other key information you might need to execute server requests in the context of a specific user.
    // The User Context can be used by Reveal SDK providers such as the
    // IRVDashboardProvider, IRVAuthenticationProvider, IRVDataSourceProvider
    // and others to restrict, or define, what permissions the user has.
    // ****


    // ****
    // NOTE:  This is ignored of it is not set in the Builder in Program.cs --> .AddUserContextProvider<UserContextProvider>()
    // ****
    public class UserContextProvider : IRVUserContextProvider
    {
        IRVUserContext IRVUserContextProvider.GetUserContext(HttpContext aspnetContext)
        {

            // ****
            // In this case, there are 3 headers sent in clear text to the server
            // Normally, you'd be accepting your token or other secrets that you'd use 
            // for the security context of your data requests
            // ****
            var userId = aspnetContext.Request.Headers["x-header-customerId"];
            var orderId = aspnetContext.Request.Headers["x-header-orderId"];
            var employeeId = aspnetContext.Request.Headers["x-header-employeeId"];

            // ****
            // Set up Roles based on the incoming user id.  In a real app, this would be set up to match
            // your scenario and be dynamically loaded
            // ****
            string role = "User";
            if (userId == "AROUT" || userId == "BLONP")
            {
                role = "Admin";
            }

            // ****
            // Create an array of properties that can be used in other Reveal functions
            // ****
            var props = new Dictionary<string, object>() {
                    { "OrderId", orderId },
                    { "EmployeeId", employeeId },
                    { "Role", role } };

            Console.WriteLine("UserContextProvider: " + userId + " " + orderId + " " + employeeId);

            return new RVUserContext(userId, props);
        }
    }
}