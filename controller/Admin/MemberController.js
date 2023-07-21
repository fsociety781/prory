const prisma = require("../../bin/prisma");
const { hashSync, genSaltSync, compareSync, hash } = require("bcrypt");
const {
  sendEmailVerification
} = require("../../email/MemberNotifikasiEmail");
class MemberController {
  static async getMembers(req, res) {
    try {
      const { search } = req.query;
      const page = req.query.page || 0;
      const limit = 10; // Jumlah data per halaman
      const offset = (page - 0) * limit;

      // Menyiapkan kondisi pencarian
      let whereCondition = {
        role: "member",
        is_active: true,
      };

      if (search) {
        whereCondition = {
          ...whereCondition,
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { username: { contains: search } },
          ],
        };
      }

      // Mengambil data dengan kondisi pencarian dan paginasi
      const members = await prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          nik: true,
          phone: true,
          address: true,
          username: true,
          email: true,
        },
        take: limit,
        skip: offset,
      });

      // Menghitung total data untuk paginasi
      const totalCount = await prisma.user.count({ where: whereCondition });
      const totalPages = Math.ceil(totalCount / limit);

      // Menentukan respons berdasarkan hasil query
      if (members.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Member Not Found",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Get Members",
          data: members,
          page: parseInt(page),
          totalPages,
          totalCount,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to search for members." });
    }
  }

  static async getMemberById(req, res) {
    try {
      let { id } = req.params;
      id = parseInt(id);

      const member = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          name: true,
          nik: true,
          phone: true,
          address: true,
          username: true,
          email: true,
        },
      });

      if (!member) {
        return res.status(404).json({
          status: "404",
          message: "Member with id " + id + " not found",
        });
      } else {
        return res.status(200).json({
          status: "200",
          message: "Success get member " + member.name + "",
          data: member,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  static async storeMember(req, res) {
    try {
      const { name, nik, phone, address, username, email, password } = req.body;
      if (
        !name ||
        !nik ||
        !phone ||
        !address ||
        !username ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          status: "400",
          message: "All parameters must be filled!",
        });
      }

      const existingUsername = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username, is_active: true },
            { username: username, is_active: false },
          ],
        },
      });

      const existingEmail = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email, is_active: true },
            { email: email, is_active: false },
          ],
        },
      });

      if (existingUsername && existingEmail) {
        return res.status(400).json({
          status: false,
          message: "Username and Email already exist",
        });
      }

      if (existingUsername) {
        return res.status(400).json({
          status: "400",
          message: "Username has already been taken",
        });
      }

      if (existingEmail) {
        return res.status(400).json({
          status: "400",
          message: "Email has already been taken",
        });
      }

      const salt = genSaltSync(10);
      const hashedPassword = hashSync(password, salt);

      const member = await prisma.user.create({
        data: {
          name: name,
          nik: nik,
          phone: phone,
          address: address,
          email: email,
          username: username,
          password: hashedPassword,
        },
        select: {
          name: true,
          email: true,
        },
      });

      await sendEmailVerification(member, email);
      return res.status(201).json({
        status: 201,
        message: "Member account successfully created. A verification email has been sent.",
        data: {
          name: member.name,
          email: member.email,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateMember(req, res) {
    try {
      const { name, nik, phone, address, username, email, password } = req.body;
      let { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({
          status: "400",
          message: "id is required",
        });
      }

      id = parseInt(id);

      const member = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!member) {
        return res.status(404).json({
          status: "404",
          message: "Member with id " + id + " not found",
        });
      }

      const existingUsername = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username, is_active: true },
            { username: username, is_active: false },
          ],
        },
      });

      const existingEmail = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email, is_active: true },
            { email: email, is_active: false },
          ],
        },
      });

      if (username && existingUsername && existingUsername.id !== id) {
        return res.status(400).json({
          status: "400",
          message: "Username has already been taken",
        });
      } else if (email && existingEmail && existingEmail.id !== id) {
        return res.status(400).json({
          status: "400",
          message: "Email has already been taken",
        });
      }

      const salt = genSaltSync(10);
      //   const hashedPassword = hashSync(password, salt);
      const updatedMember = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name || member.name,
          nik: nik || member.nik,
          phone: phone || member.phone,
          address: address || member.address,
          email: email || member.email,
          username: username || member.username,
          password: password ? hashSync(password, salt) : member.password,
        },
      });

      if (!updatedMember) {
        return res.status(400).json({
          success: false,
          message: "failed to update member",
        });
      }

      return res.status(201).json({
        status: "201",
        message: "Member account has succesfully updated",
        data: {
          name: updatedMember.name,
          nik: updatedMember.nik,
          phone: updatedMember.phone,
          address: updatedMember.address,
          email: updatedMember.email,
          username: updatedMember.username,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async deleteMember(req, res) {
    try {
      let { id } = req.params;
      id = parseInt(id);

      const member = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!member) {
        return res.status(404).json({
          status: "404",
          message: "Member with id " + id + " not found",
        });
      }

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          is_active: false,
        },
      });

      return res.status(200).json({
        status: "200",
        message: "Member account has succesfully deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = MemberController;
