<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage' }">订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始日期" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="发货状态">
          <el-select v-model="filters.Type" placeholder="发货状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品描述:">
              <span>{{ props.row.ProductName }}</span>
            </el-form-item>
            <el-form-item label="实付金额:">
              <span>{{ props.row.Price }}元</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="创建时间" prop="CreateTime">
      </el-table-column>
      <!-- <el-table-column label="商品描述" prop="ProductName">
      </el-table-column> -->
      <el-table-column label="用户名" prop="Name">
      </el-table-column>
      <el-table-column label="联系方式" prop="Phone">
      </el-table-column>
      <el-table-column label="订单状态" prop="Status" :formatter="Status">
      </el-table-column>
      <!-- <el-table-column label="实付款（元）" prop="Price">
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.Status == 2" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" v-if="scope.row.Status == 1" type="danger" plain icon="el-icon-upload2" @click="handleSend(scope.$index, scope.row)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" style="width:100%;text-align:center;">
        <el-form-item label="收件人" prop="Name">
          <el-input v-model="editForm.Name" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="Phone">
          <el-input  v-model.number="editForm.Phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="Address">
          <el-input v-model="editForm.Name" Address disabled></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="Company">
          <el-select v-model="editForm.Company" prop="Company" filterable label="请选择快递公司" size="medium" @change="selectLable">
          <el-option
            v-for="item in expresss"
            :key="item.uId"
            :label="item.label"
            :value="item.uId">
          </el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="快递单号" prop="logisticsNo">
          <el-input v-model="editForm.logisticsNo" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 发货界面 -->
    <el-dialog title="发货" :visible.sync="sendFormVisible">
      <el-form :model="sendForm" label-width="80px" :rules="sendFormRules" ref="sendForm" style="width:100%;text-align:center;">
        <el-form-item label="收件人" prop="Name">
          <el-input v-model="sendForm.Name" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="Phone">
          <el-input  v-model.number="sendForm.Phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址" Address>
          <el-input v-model="sendForm.Address" disabled></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="company">
          <el-select v-model="sendForm.Company" prop="Company" filterable label="请选择快递公司" size="medium" @change="selectSendLable">
          <el-option
            v-for="item in expresss"
            :key="item.uId"
            :label="item.label"
            :value="item.uId">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logisticsNo">
          <el-input v-model="sendForm.logisticsNo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="sendFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="sendSubmit" :loading="sendLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
// import "../../../static/jquery-search.js";
import expresss from "../../../static/express.js";
export default {
  data() {
    return {
      orderList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      mainurl: "",
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: "",
        StTime: "2018-01-01",
        EndTime: "",
        Type: 0
      },
      // 状态数组
      typeList: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "待发货",
          value: 1
        },
        {
          name: "待收货",
          value: 2
        }
      ],
      // 快递公司数组
      expresss: [],
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        Name: "",
        Phone: "",
        Address: "",
        Company: "",
        orderid: "",
        logisticsNo: ""
      },
      editFormRules: {
        Company: [
          {
            required: true,
            message: "请选择快递公司",
            trigger: "blur"
          }
        ],
        logisticsNo: [
          {
            required: true,
            message: "请输入快递单号",
            trigger: "blur"
          }
        ]
      },
      //发货界面是否显示
      sendFormVisible: false,
      sendLoading: false,
      //发货界面数据
      sendForm: {
        Name: "",
        Phone: "",
        Address: "",
        Company: "",
        logisticsNo: ""
      },
      sendFormRules: {
        Company: [
          {
            required: true,
            message: "请选择快递公司",
            trigger: "blur"
          }
        ],
        logisticsNo: [
          {
            required: true,
            message: "请输入快递单号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
    getInfo() {
      this.$http
        .get("../../../static/JSON/Order.json"
        //   "/hxmback/api/Back/O_GetOrderList", {
        //   Token: getCookie("token"),
        //   PageIndex: this.pageIndex,
        //   PageSize: this.pageSize,
        //   Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
        //   Type: this.filters.Type,
        //   StTime: this.filters.StTime,
        //   EndTime: this.filters.EndTime == "" ? "-1" : this.filters.EndTime
        // }
        )
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.List;
              this.pageCount = response.data.Result.Page;
            } else if (status === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
              setTimeout(() => {
                this.$router.push({
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
    //关键字搜索
    getUsers() {
      this.getInfo();
      // console.log(this.filters)
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    Status(row, status) {
      var status = row[status.property];
      switch (status) {
        case 0:
          return (status = "待付款");
          break;
        case 1:
          return (status = "待发货");
          break;
        case 2:
          return (status = "已发货");
          break;
        default:
          return (status = "已完成");
          break;
      }
    },
    /*
          1、添加编辑时获取角色列表，渲染下拉菜单
          2、点击管理员列表的编辑，弹出模态框
          3、点击新增管理严，弹出模态框
          4、保存修改
          5、保存添加
        */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      console.log(obj);
      this.editForm.Name = obj.Name;
      this.editForm.orderid = obj.id;
      this.editForm.logisticsNo = obj.OrderNo;
      this.editForm.Phone = obj.Phone;
      this.editForm.Address = obj.Address;
      this.editFormVisible = true;
      for (var i = 0; i < expresss.length; i++) {
        var element = expresss[i];
        if (element.uId == obj.Company) {
          // console.log(expresss[i].label);
          return (this.editForm.Company = expresss[i].label);
        }
      }
    },
    handleSend(index, row) {
      var obj = Object.assign({}, row);
      this.sendForm.Name = obj.Name;
      this.sendForm.Phone = obj.Phone;
      this.sendForm.Address = obj.Address;
      this.sendFormVisible = true;
    },
    selectLable(e) {
      this.editForm.orderid = e;
    },
    selectSendLable(e) {
      console.log(e);
      this.sendForm.orderid = e;
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);
            // 将token传入参数中
            console.log(para);
            para.Token = getCookie("token");
            // 发保存请求
            this.$http
              .get("/hxmback/api/Admin/Edit", {
                // params: para
              })
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
    sendSubmit() {
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.sendLoading = true;
            //NProgress.start();
            var para = Object.assign({}, this.sendForm);
            console.log(para);
            // 将token传入参数中
            para.Token = getCookie("token");
            // 发保存请求
            this.$http
              .get("/hxmback/api/Admin/Add", {
                // params: para
              })
              .then(
                function(response) {
                  this.sendLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["sendForm"].resetFields();
                    this.sendFormVisible = false;
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
    this.expresss = expresss;
    this.mainurl = mainurl;
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
/* 弹出框 */
.el-dialog__body .el-form-item {
  width: 60%;
  margin-left: calc(50% - 30%);
}
/* 选择公司 */
.el-select--medium {
  width: 100%;
}
.el-input--medium {
  width: 100%;
}
</style>
