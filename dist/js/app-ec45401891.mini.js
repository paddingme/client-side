var myApp=angular.module("myApp",["ngRoute"]),options={};options.api={},options.api.base_url="http://127.0.0.1:3000",myApp.config(function(t){t.when("/",{templateUrl:"partials/main.html",controller:"MainCtrl"}).when("/login",{templateUrl:"partials/login.html",controller:"UserCtrl"}).when("/logout",{templateUrl:"partials/logout.html",controller:"UserCtrl"}).when("/show",{templateUrl:"partials/show.html",controller:"ShowCtrl",access:{requiredAuthentication:!0}}).when("/catalogs",{templateUrl:"partials/catalogs.html",controller:"CatalogCtrl",access:{requiredAuthentication:!0}}).otherwise({redirectTo:"/"})}),myApp.config(function(t){t.interceptors.push("TokenInterceptor")}),myApp.run(function(t,o,e,n){t.$on("$routeChangeStart",function(t,r,s){null==r||null==r.access||!r.access.requiredAuthentication||n.isAuthenticated||e.sessionStorage.token||o.path("/")})}),myApp.controller("ShowCtrl",["$scope",function(t){}]),myApp.controller("MainCtrl",["$scope",function(t){}]),myApp.controller("CatalogCtrl",["$scope","BookService",function(t,o){console.log(222),o.showCatalogs().success(function(o){console.log(o),t.catalogs=o}).error(function(t,o){console.log(t),console.log(o)})}]),myApp.controller("UserCtrl",["$scope","$location","$timeout","$window","UserService","AuthenticationService",function(t,o,e,n,r,s){t.signIn=function(i,c){null!=i&&null!=c&&r.signIn(i,c).success(function(r){r.success?(s.isAuthenticated=!0,n.sessionStorage.token=r.token,t.resInfo="用户名密码正确，3秒钟后跳转",e(function(){o.path("/show")},3e3)):t.resInfo=r.message,console.log(r)}).error(function(t,o){console.log(t),console.log(o)})},t.logOut=function(){s.isAuthenticated?r.logOut().success(function(r){s.isAuthenticated=!1,delete n.sessionStorage.token,console.log(r+"222"),t.logoutInfo=r.message+" 3 秒钟会跳转回主页！",e(function(){o.path("/")},3e3)}).error(function(t,o){console.log(t),console.log(o)}):o.path("/")}}]),myApp.factory("AuthenticationService",function(){var t={isAuthenticated:!1,isAdmin:!1};return t}),myApp.factory("TokenInterceptor",["$q","$window","$location","AuthenticationService",function(t,o,e,n){return{request:function(t){return t.headers=t.headers||{},o.sessionStorage.token&&(t.headers.Authorization="Bearer "+o.sessionStorage.token),console.log(t.headers.Authorization),t},requestError:function(o){return t.reject(o)},response:function(e){return null!=e&&200==e.status&&o.sessionStorage.token&&!n.isAuthenticated&&(n.isAuthenticated=!0),e||t.when(e)},responseError:function(r){return null!=r&&401===r.status&&(o.sessionStorage.token||n.isAuthenticated)&&(delete o.sessionStorage.token,n.isAuthenticated=!1,e.path("/login")),t.reject(r)}}}]),myApp.factory("UserService",["$http",function(t){return{signIn:function(o,e){return t.post(options.api.base_url+"/user/signin",{username:o,password:e})},logOut:function(){return t.get(options.api.base_url+"/user/logout")}}}]),myApp.factory("BookService",["$http",function(t){return{showCatalogs:function(){return t.get(options.api.base_url+"/api/catalogs")},showbootmarks:function(){return t.get(options.api.base_url+"/api/bookmarks")}}}]);