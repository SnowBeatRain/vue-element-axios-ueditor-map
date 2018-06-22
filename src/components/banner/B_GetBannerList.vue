<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item>Banner管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="roleList" style="width: 100%" :border='true'>
      <el-table-column label="图片" prop="Image">
        <template slot-scope="scope">
          <img :src="scope.row.Image" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="端口类型" prop="Type" :formatter="typeText">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleSetting(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="图片：" >
          <el-upload v-model="editForm.Image"  class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="端口类型：">
          <el-select v-model="editForm.Type" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="图片：">
          <el-upload v-model="editForm.Image"  class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="端口类型：">
          <el-select v-model="addForm.Type" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 3,
      pageCount: 1,
      roleList: [], //管理员角色列表
      typeList: [
        {
          name: "pc端",
          type: 0
        },
        {
          name: "App端/小程序",
          type: 1
        },
        {
          name: "手机浏览pc端",
          type: 2
        }
      ],
      filters: {
        keywords: ""
      },
      action: "http://hxm.nbxuanma.com/api/Photo/UpdateForImage?type=1",
      imageUrl: "",
      imageUrl1: "",
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        Image: "",
        Type: "",
        ID: ""
      },
      editFormRules: {
        Image: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }
        ]
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        Image: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        Image: "",
        Type: "",
        IsJump: false,
        Url: "-1"
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      //   上传图后的返回值赋值给editFrom表单
      this.editForm.Image = res.Result[0];
    },
    handleAvatarSuccess1(res, file) {
      this.imageUrl1 = URL.createObjectURL(file.raw);
      //   上传图后的返回值赋值给editFrom表单
      this.addForm.Image = res.Result[0];
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    /*
             1、获取列表 渲染列表
          */
    getInfo() {
      this.$http
        .get("../../../static/JSON/Banner.json"
          // "/hxmback/api/Back/B_GetBannerList", 
        // {
        //   params: {
        //     token: getCookie("token"),
        //     pageIndex: this.pageIndex,
        //     pageSize: this.pageSize
        //   }
        // }
        )
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.roleList = response.data.Result.List;
              this.pageCount = response.data.Result.Page;
            } else if (status === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
              setTimeout(() => {
                tt.$router.push({
                  path: "/login"
                });
              }, 1500);
            }
          }.bind(this)
        )
        // 请求error
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    typeText(row, Type) {
      var type = row[Type.property];
      switch (type) {
        case 0:
          return (type = "pc端");
          break;
        case 1:
          return (type = "App端/小程序");
          break;
        case 2:
          return (type = "手机浏览pc端");
          break;
        default:
          break;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    /*
            1、跳转设置页面,
            2、点击管理员列表的编辑，弹出模态框
            3、点击新增管理严，弹出模态框
            4、保存修改
            5、保存添加
          */

    handleSetting(index, row) {
      var obj = Object.assign({}, row);
      console.log(obj);
      var urlId = obj.ID;
      //判断是否填写完整  --true
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        // 发保存请求
        this.$http
          .get("/hxmback/api/Back/B_DelBanner", {
              params:{
                  token:getCookie("token"),
                  id:urlId
              }
          })
          .then(
            function(response) {
              this.editLoading = false;
              var status = response.data.Status;
              if (status === 1) {
                this.getInfo();
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  tt.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function(error) {
              this.editLoading = false;
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      });
    },
    handleEdit(index, row) {
      console.log(Object.assign({}, row));
      var obj = Object.assign({}, row);
      this.editFormVisible = true;
      this.editForm = obj;
      //  拿到的image去展示编辑的图片
      this.imageUrl = obj.Image;
    },
    handleAdd() {
      this.addFormVisible = true;
    },

    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            para.Url = "-1";
            para.Image = para.Image.split(".com")[1];

            // 发保存请求
            this.$http
              .post("/hxmback/api/Back/B_EditBanner", para)
              .then(
                function(response) {
                  this.editLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.getInfo();
                  } else if (status === 40001) {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.Result
                    });
                    setTimeout(() => {
                      tt.$router.push({
                        path: "/login"
                      });
                    }, 1500);
                  } else {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.Result
                    });
                  }
                }.bind(this)
              )
              // 请求error
              .catch(
                function(error) {
                  this.editLoading = false;
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          });
        }
      });
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            var para = Object.assign({}, this.addForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            console.log(para);
            // 发保存请求
            this.$http
              .post("/hxmback/api/Back/B_AddBanner", para)
              .then(
                function(response) {
                  this.addLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
                    this.getInfo();
                  } else if (status === 40001) {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.Result
                    });
                    setTimeout(() => {
                      tt.$router.push({
                        path: "/login"
                      });
                    }, 1500);
                  } else {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.Result
                    });
                  }
                }.bind(this)
              )
              // 请求error
              .catch(
                function(error) {
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          });
        }
      });
    }
  },
  mounted() {
    this.getInfo();
  }
};
</script>
<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}

.block {
  text-align: center;
  padding: 20px 0;
}

.avatar-uploader {
  /* width: 317px; */
}

.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload--text {
  width: 100%;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 317px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #8c939d;
}

.avatar {
  width: 100%;
}
</style>
