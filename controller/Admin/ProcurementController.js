const prisma = require("../../bin/prisma");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

class ItemsController {
  static async getAllItems(req, res, next) {
    try {
      const { search, categoryId, status } = req.query;
      const page = req.query.page || 0;
      const limit = 10; // Jumlah data per halaman
      const offset = (page - 0) * limit;
      const allowedStatus = ["onprocess", "approve", "reject"];

      let whereCondition = {};
      let statusCondition = "get all";
      if (search && categoryId) {
        whereCondition = {
          detailItems: {
            name: {
              contains: search,
            },
            categoryId: {
              equals: parseInt(categoryId),
            },
          },
        };

        statusCondition = "search and category";
      } else if (search) {
        whereCondition = {
          detailItems: {
            name: {
              contains: search,
            },
          },
        };

        statusCondition = "search";
      } else if (categoryId) {
        whereCondition = {
          detailItems: {
            categoryId: {
              equals: parseInt(categoryId),
            },
          },
        };

        statusCondition = "category";
      } else if (status && allowedStatus.indexOf(status) > -1) {
        whereCondition = {
          status: {
            equals: status,
          },
        };

        statusCondition = "status";
      }

      const items = await prisma.items.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              name: true,
            },
          },
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
          history: {
            select: {
              reason: true,
            },
          },
        },
        take: limit,
        skip: offset,
      });

      const totalCount = await prisma.items.count({ where: whereCondition });

      if (items.length === 0) {
        return res.status(200).json({
          status: "204",
          message: "No item found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: `Success ${statusCondition}`,
          data: items,
          page: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async getItemId(req, res, next) {
    try {
      let { id } = req.params;
      id = parseInt(id);

      if (id) {
        const item = await prisma.items.findUnique({
          where: {
            id: id,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
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
            history: {
              select: {
                reason: true,
              },
            },
          },
        });

        if (!item) {
          return res.status(404).json({
            status: "404",
            message: "Item not found",
          });
        }

        return res.status(200).json({
          status: true,
          message: "Succes Get Detail Item",
          data: item,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "info.procurement04@gmail.com",
          pass: "pwsdsrlmxhlltgpa",
        },
      });

      let { id } = req.params;
      const { status } = req.body;
      let reason = req.body.reason;
      id = parseInt(id);

      const availableStatus = ["onprocess", "approve", "reject"];

      if (!availableStatus.includes(status)) {
        return res.status(404).json({
          status: "404",
          message:
            "Please choose an available status: onprocess, approve, reject",
        });
      }

      let item = await prisma.items.findUnique({
        where: {
          id: id,
        },
      });

      if (!item) {
        return res.status(404).json({
          status: "404",
          message: "Item not found",
        });
      }

      if (item && (item.status === "approve" || item.status === "reject")) {
        return res.status(400).json({
          status: "400",
          message: "Item has already been processed",
        });
      }

      if (status === "reject" && !reason) {
        return res.status(400).json({
          status: "400",
          message: "Reason is required for reject status",
        });
      }

      item = await prisma.items.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });

      if (status === "approve") {
        reason = undefined;
      }

      const history = await prisma.history.create({
        data: {
          itemsId: id,
          reason: reason,
        },
      });

      const alasan = await prisma.history.findUnique({
        where: {
          id: history.id,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: item.userId,
        },
      });

      const detail = await prisma.detail_items.findUnique({
        where: {
          id: item.detailId,
        },
      });

      const tanggal = await prisma.items.findUnique({
        where: {
          id: item.id,
        },
      });

      const namaUser = user.name;
      const namaitem = detail.name;
      const deskripsi = detail.description;
      const qty = detail.quantity;
      const total = detail.total;
      const create = tanggal.createdAt;
      const update = tanggal.updatedAt;
      const alasanitem = alasan.reason;

      const templateApprove = path.resolve(
        __dirname,
        "../../template",
        "templateApprove.ejs"
      );

      let templateReject;

      if (status === "reject") {
        templateReject = path.resolve(
          __dirname,
          "../../template",
          "templateReject.ejs"
        );
      }

      const template = await ejs.renderFile(templateApprove, {
        namaUser,
        namaitem,
        deskripsi,
        qty,
        alasanitem,
        total,
        create,
        update,
        status: status,
      });

      const mailOptionsApprove = {
        from: "info.procurement04@gmail.com",
        to: user.email,
        subject: "PRORYVI : Pengajuan di " + status,
        html: template,
      };

      let infoEmail;

      if (status === "reject") {
        const templateRejectRendered = await ejs.renderFile(templateReject, {
          namaUser,
          namaitem,
          deskripsi,
          qty,
          alasanitem,
          total,
          create,
          update,
          status: status,
        });

        const mailOptionsReject = {
          from: "info.procurement04@gmail.com",
          to: user.email,
          subject: "PRORYVI : Pengajuan di " + status,
          html: templateRejectRendered,
        };

        infoEmail = await transporter.sendMail(mailOptionsReject);
      } else {
        infoEmail = await transporter.sendMail(mailOptionsApprove);
      }

      return res.status(200).json({
        status: "200",
        message:
          "Item status successfully changed to " +
          status +
          " and Email Notification sent to " +
          user.email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = ItemsController;
