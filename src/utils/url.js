const HOME = "http://localhost:8080"

export default {
    adminLogin: () => "/mock/adminLogin.json",
    adminForget: () => "/mock/adminForget.json",
    adminFetchSiderContent: () => "/mock/adminFetchSiderContent.json",
    companyInfo: () =>
        HOME + "/company",
    // "/mock/companyInfo.json",
    alterCompanyInfo: () =>
        HOME + "/company",
    //"/mock/companyInfo.json",
    fetchShop: (uid) => 
    HOME+`/shop/${uid}`,
    // "/mock/shopInfo.json",
    fetchShops: () => 
    HOME+"/shops",
    // "/mock/shopList.json",
    removeShop:(uid)=>HOME+`/shop/${uid}`,
    //"/mock/alterBoxInfo.json",
    fetchAllClerks: () => "/mock/allClerks.json",
    alterBoxInfo: () => "/mock/alterBoxInfo.json",
    removeShopBox: (uid) => HOME+`/shopBox/${uid}`,
    // "/mock/alterBoxInfo.json",
    addBoxInfo: () => HOME+"/shopBox",
    // "/mock/addBoxInfo.json",
    alterShopInfo: () => "/mock/alterBoxInfo.json",
    addShop: () => HOME+"/shop",
    // "/mock/addShop.json",
    fetchAllAuthority: () => "/mock/allAuthority.json",
    fetchAllPosition: () => "/mock/allPosition.json",
    alterClerkInfo: () => "/mock/alterClerkInfo.json",
    deleteClerk: () => "/mock/alterClerkInfo.json",
    addClerk: () => "/mock/addClerk.json",
    fetchProductType: () => "/mock/productType.json",
    fetchProductDetailByType: () => "/mock/productDetailByType.json",
    fetchCustomerType: () => "/mock/customerType.json",
    fetchActivities: () => "/mock/activities.json",
    terminalActivity: () => "/mock/alterBoxInfo.json",
    addActivity: () => "/mock/activities.json",
    createNewProductType: () => "/mock/productType.json",
    createNewProduct: () => "/mock/productDetailByType.json",
    terminalProductSale: () => "/mock/productDetailByType.json",
    alterProductInfo: () => "/mock/productDetailByType.json",
    fetchEnterpriseCustomerApplication: () => "/mock/enterpriseCustomerApplication.json",
    startApplicationCheck: () => "/mock/enterpriseCustomerApplication.json",
    admitApplication: () => "/mock/enterpriseCustomerApplication.json",
    rejectApplication: () => "/mock/enterpriseCustomerApplication.json",
    fetchAllCustomers: () => "/mock/customers.json",
    setSuperVIP: () => "/mock/customers.json",
    fetchOrdersByCustomer: () => "/mock/ordersByCustomer.json",
    fetchCustomerById: () => "/mock/customer.json",
    deleteOrder: () => "/mock/ordersByCustomer.json",
    deleteOrderByBatch: () => "/mock/ordersByCustomer.json",
    fetchOrderById: () => "/mock/order.json",
    uploadPhoto:()=>HOME+"/savephoto",
    fetchShopBoxes:()=>HOME+"/shopBoxes",
    fetchShopBox:(uid)=>HOME+`/shopBox/${uid}`,
}