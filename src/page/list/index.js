/**
 * Created by Administrator on 2017/7/15.
 */
'use strict';
require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var  _product       = require('service/product-service.js');
var templateIndex   = require('./index.string');
var Pagination      = require('util/pagination/index.js');


var page = {
    data    : {
        listParam  : {
            keyword         : _mm.getUrlParam('keyword')    || '',
            categoryId      : _mm.getUrlParam('categoryId') || '',
            orderBy         : _mm.getUrlParam('orderBy')    || 'default',
            pageNum         : _mm.getUrlParam('pageNum')    || 1,
            pageSize        : _mm.getUrlParam('pageSize')   || 20
        }
    },
    init        : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad      : function(){
        this.loadList();
    },
    bindEvent   : function(){
        var _this = this;
        //排序的点击事件
            $('.sort-item').click(function(){
                var $this = $(this);
                //点击一次刷新页面 页码变为1
                _this.data.listParam.pageNum = 1;
                //点击默认排序
                if($this.data('type') ==='default'){
                    //如果已经有active 类 则返回
                    if($this.hasClass('active')){
                        return ;
                    }
                    //没有的话加上
                    else{
                        $this.addClass('active').siblings('.sort-item')
                            .removeClass('active asc desc');
                        _this.data.listParam.orderBy = 'default';
                    }
                }
                //点击按价格排序
                else if($this.data('type') ==='price'){
                    //在价格排序中加上active 类 并移除默认排序上的active
                    $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                    //如果是降序 则改成升序 并改变data 的orderBy 接口定义改为 'price_asc'
                    if(!$this.hasClass('asc')){
                        $this.addClass('asc').removeClass('desc');
                        _this.data.listParam.orderBy = 'price_asc';
                    }
                    //如果是升序 则改成降序
                    else{
                        $this.addClass('desc').removeClass('asc');
                        _this.data.listParam.orderBy = 'price_desc';
                    }
                }
                //重新加载列表
                _this.loadList();
            });
    },
    //加载list 数据
    loadList    : function(){
        var listParam = this.data.listParam,
            listHtml  = '',
            _this     = this,
            $pListCon = $('.p-list-con');
        $pListCon.html('<div class="loading"></div>');
        //删除参数中不必要的字段 如果有 Id 则删除 keyword  反之删除Id
        listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
        //请求接口
        _product.getProductList(listParam,function(res){
            listHtml = _mm.renderHtml(templateIndex,{
                list : res.list
            });
            $pListCon.html(listHtml);
            _this.loadPagination({
                hasPreviousPage      : res.hasPreviousPage,
                prePage              : res.prePage,
                hasNextPage          : res.hasNextPage,
                nextPage             : res.nextPage,
                pageNum              : res.pageNum,
                pages                : res.pages,
            });
        },function(errMsg){
                _mm.errorTips(errMsg);
        });
    },
    //加载分页信息
    loadPagination : function(pageInfo){
        var _this = this ;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({},pageInfo,{
            container        : $('.pagination'),
            onSelectPage     : function(pageNum){
                _this.data.listParam.pageNum = pageNum;
                _this.loadList();
            }
        }));
    }
};
$(function(){
    page.init();
})