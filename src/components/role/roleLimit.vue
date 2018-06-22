<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- table 内容 -->
    <table class="table">
      <tbody>
        <tr>
          <td width="200px">角色名称</td>
          <td width="">
            {{name}}
          </td>
        </tr>
        <tr>
          <td>权限</td>
          <td>
            <ul class="miantable">
              <li v-for="(items,index) in list" :key="index">
                <span @click="togglemun(index)">
                    <i :class="isopen==index?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
                    <a>{{items.Menu}}</a>
                </span>
                <ul class="seconuntable" v-if="isopen==index">
                  <li v-for="(iten,ii) in items.SubMenu" :key="ii">
                    <div class="relativedfg">
                        <i class="el-icon-d-arrow-right"></i>
                        <a>{{iten.SubMenu}}</a>
                        <i @click="huoqu($parent.index,index,items.MenuID,iten.SubMenuID,iten.IsSelect)"
                         :class="iten.IsSelect?'el-icon-circle-check-outline':'el-icon-circle-close-outline'" style="cursor: pointer;"></i>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      name:"",
      isopen: -1
    };
  },
  methods: {
    /*
           1、获取列表 渲染列表
        */
    getInfo(id) {
      this.$http
        .get("/hxmback/api/Role/GetMenuJurisdiction", {
          params: {
            RoleID: id
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.list = response.data.Result;
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
    togglemun(index) {
      if (this.isopen == index) {
        this.isopen = -1;
      } else {
        this.isopen = index;
      }
    },
    huoqu(parentindex, $index, MenuID, SubMenuID, IsSelect) {
      var RoleID = window.location.href.split("id=")[1].split("&rolename")[0];
      this.$http
        .get("/hxmback/api/Role/AddMenuJurisdiction", {
          params: {
            MenuID: MenuID,
            SubMenuID: SubMenuID,
            RoleID: RoleID,
            Token: getCookie("token")
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.getInfo(RoleID);
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
        );
    }
  },
  mounted() {
    var id = window.location.href.split("id=")[1].split("&rolename")[0];
    var name = window.location.href.split("&rolename=")[1];
    this.name = decodeURI(name);
    this.getInfo(id);
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

table {
  width: 100%;
  border-collapse: collapse;
  /*关键代码*/
}

tr td {
  padding: 12px 15px;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  border: 1px solid #ebeef5;
}

.miantable li a {
  display: inline-block;
  border-radius: 6px;
  text-align: left;
  margin-bottom: 5px;
  padding: 3px 0;
}

.seconuntable {
  margin-left: 48px;
  display: block;
}
</style>
