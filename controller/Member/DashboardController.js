const prisma = require("../../bin/prisma");

class DashboardController {
  static async index(req, res) {
    const { filter } = req.query;

    let startDate, endDate;

    // Filter berdasarkan per minggu
    if (filter === "perminggu") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
    }

    // Filter berdasarkan per bulan
    if (filter === "perbulan") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      endDate = new Date();
    }

    // Filter berdasarkan per tahun
    if (filter === "pertahun") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(0);
      startDate.setDate(1);
      endDate = new Date();
    }
    try {
      const { id: userId } = req.user;
      const total = await prisma.items.count({ where: { userId } });
      const oprocess = await prisma.items.count({
        where: {
          userId,
          status: "onprocess",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      const approved = await prisma.items.count({
        where: {
          userId,
          status: "approve",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      const rejected = await prisma.items.count({
        where: {
          userId,
          status: "reject",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const lastRequest = await prisma.items.findMany({
        where: {
          userId,
          status: "onprocess",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          detailItems: {
            select: {
              name: true,
              url: true,
              description: true,
              category: {
                select: {
                  category: true,
                },
              },
              quantity: true,
              price: true,
              total: true,
              duedate: true,
            },
          },
        },
      });

      let filterMessage = "";
      if (filter === "perminggu") {
        filterMessage = "Data terfilter untuk satu minggu terakhir";
      } else if (filter === "perbulan") {
        filterMessage = "Data terfilter untuk satu bulan terakhir";
      } else if (filter === "pertahun") {
        filterMessage = "Data terfilter untuk satu tahun terakhir";
      }

      return res.status(200).json({
        success: true,
        message: "get data for dashboard",
        requestInventory: {
          total,
          oprocess: oprocess,
          approved: approved,
          rejected: rejected,
        },
        lastRequest,
        filter: filterMessage,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = DashboardController;
