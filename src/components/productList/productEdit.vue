<template>
  <div>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/P_GetProductList' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>商品编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="商品名称" prop="Name">
          <el-input v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="Price">
          <el-input v-model.number="editForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="商品库存（件）" prop="Stock">
          <el-input v-model.number="editForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="Image">
          <el-upload v-model="editForm.Image" class="avatar-uploader" :limit="5" :action="action" :on-preview="handlePictureCardPreview"
            list-type="picture-card" :file-list="Images" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>最多上传五张，且图片宽高比为：1/1</span>
        </el-form-item>
        <el-form-item label="邮费选择" prop="IsFreeShipping">
          <el-radio-group v-model="editForm.IsFreeShipping">
            <el-radio class="radio" :label="true">包邮</el-radio>
            <el-radio class="radio" :label="false">运费模版</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品简介" prop="Brief">
          <el-input type="textarea" v-model="editForm.Brief"></el-input>
        </el-form-item>
        <el-form-item label="图文详情" prop="Details">
          <el-button type="info" @click="clickOpenDetail(editForm.Details)">图文详情</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即修改</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <!-- 弹出框 图文详情 -->
    <el-dialog title="图文编辑" :visible.sync="openDetails">
      <!-- <button @click="getUEContent()">获取内容</button> -->
      <div class="editor-container">
        <UEditor :defaultMsg='defaultMsg' :config='config' ref="ueditor"></UEditor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="openDetails=false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UEditor from "../UEditor.vue";

export default {
  data() {
    var checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("价格不能为空"));
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkStock = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("库存不能为空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("库存必须为整数"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      mainurl: "http://hxm.xxxxxxx.com",  // 域名
      action: "http://hxm.xxxxxx.com/api/Photo/UpdateForImage?type=0",  // 上传图接口地址，
      dialogImageUrl: "",
      dialogVisible: false,
      editForm: {
        Name: "", //名称
        Price: "", //价格
        Stock: "", //库存
        Image: [], //图片
        IsFreeShipping: false, //邮费选择
        Brief: "", //简介
        Details: ""
      },
      Images: [],
      rules: {
        Name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        Price: [
          {
            validator: checkPrice
            // trigger: 'blur'
          }
        ],
        Stock: [
          {
            validator: checkStock
            // trigger: 'blur'
          }
        ],
        IsFreeShipping: [
          {
            required: true,
            message: "请选择邮费",
            trigger: "change"
          }
        ],
        Image: [
          {
            type: "array",
            required: true,
            message: "请上传商品图片",
            trigger: "change"
          }
        ],
        Brief: [
          {
            required: true,
            message: "请输入商品简介",
            trigger: "blur"
          }
        ],
        Details: [
          {
            required: true,
            message: "图文详情不能为空",
            trigger: "blur"
          }
        ]
      },
      // 图文详情
      openDetails: false,

      defaultMsg: "这里是初始化内容",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      }
    };
  },
  components: { UEditor },
  methods: {
    // 修改提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            para.ID = window.location.href.split("id=")[1];
            para.Image = para.Image.join(",");
            // console.log(this.Images)
            console.log(para);
            // 发保存请求
            this.$http
              .post("/hxmback/api/Back/P_ProductEdit", para)
              .then(
                function (response) {
                  this.editLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.$router.push({
                      path: "/P_GetProductList"
                    })
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
                function (error) {
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /*
       移除图片 
        handleRemove(file, fileList)  移除的文件，剩下的图片数组（带有域名，需要去掉）
      */
    handleRemove(file, fileList) {
      var newArr = [];
      for (let index = 0; index < fileList.length; index++) {
        var element = [fileList[index].url.split(".com")[1]];
        newArr = newArr.concat(element);
      }
      this.editForm.Image = newArr;
    },
    /*
      上传成功的回调函数
        handleAvatarSuccess(response, file, fileList) 
        respomse:请求回调，返回上传的图片地址
        file：该图片的参数信息
        fileList 返回当前所有的图片数组，
      */
    handleAvatarSuccess(response, file, fileList) {
      var arrImg = [];
      arrImg = arrImg.concat(response.Result[0]);
      this.editForm.Image = this.editForm.Image.concat(arrImg);
    },
    /*
      点击打开图文详情框
      
      */

    clickOpenDetail(detail) {
      this.openDetails = true;
      this.defaultMsg = decodeURIComponent(detail);
    },
    addSubmit() {
      var content = this.$refs.ueditor.getUEContent();
      this.editForm.Details = encodeURIComponent(content);
      this.openDetails = false;
      console.log(this.editForm);
    },
    /*
      重置表单
      */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    var id = window.location.href.split("id=")[1];
    this.$http
      .get("/hxmback/api/Back/P_GetProductDetail", {
        params: {
          ID: id,
          token: getCookie("token")
        }
      })
      .then(
        function(response) {
          var status = response.data.Status;
          if (status === 1) {
            this.editForm = response.data.Result;
            console.log(this.editForm);
            var newArr = response.data.Result.Image;
            var newObj = {};
            for (var i = 0; i < newArr.length; i++) {
              var element = [
                {
                  url: mainurl + newArr[i]
                }
              ];
              this.Images = this.Images.concat(element);
            }
            // 将ID传入参数中
            // this.editForm.ID = obj.ID;
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
  }
};
</script>
<style scoped>
</style>
