import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { vendorRoute } from "../modules/vendor/vendor.route";
import { produceRoute } from "../modules/produce/produce.route";
import { adminRoute } from "../modules/admin/admin.route";
import { communityPostRoute } from "../modules/community/community.route";
import { rentRoute } from "../modules/rent/rent.route";
import { orderRoute } from "../modules/order/order.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/vendor",
    route: vendorRoute,
  },
  {
    path: "/produce",
    route: produceRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/community-post",
    route: communityPostRoute,
  },
  {
    path: "/rent",
    route: rentRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
