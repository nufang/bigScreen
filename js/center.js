
$(document).ready(function () {

    setInterval(function () {
        //获取当前时间
        function getNow(s) {
            return s < 10 ? '0' + s: s;
        }
        var myDate = new Date();
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes();     //获取当前分钟数(0-59)
        var s=myDate.getSeconds();
        var now=year+'年'+getNow(month)+"月"+getNow(date)+"日"+getNow(h)+':'+getNow(m)+":"+getNow(s);
        $('.right-time').html(now);
        $('.left-time').html(now);
    },1000);

    (function init() {
        $.ajax({
            method: 'get',
            //url: 'js/data.json',
            url: 'http://202.201.156.92:8080/screen/enrollinfo/detail',
            success: function (data) {
                var year = [], index = 0;
                data.enrollDetails.forEach(function (n,i) {
                    year.push(n.year);
                });
                chinaDetail(data.enrollNationDetails,2015);
                enrollProfessions(data.enrollProfessions,2015);
                var timer = setInterval(function () {
                    var clock = index % year.length;
                    //中国地图
                    chinaDetail(data.enrollNationDetails,year[clock]);
                    //全国招生详情 男女比例
                    enrollProfessions(data.enrollProfessions,year[clock]);
                    $('.head .fr').html(year[clock]+'年');
                    index ++;
                },68000)
            }
        })

    })();
    //全国招生详情 男女比例
    function enrollProfessions(data,time) {
        var datas = {};
        data.forEach(function (n,i) {
            if(n.year == time){
                datas = n.data[0];
            }
        });
        $('#enrollProfessions').html(' <ul class="col-md-7 row">\n' +
            '                    <div class="count-item">\n' +
            '                        <li class="col-md-4">本科人数</li>\n' +
            '                        <li class="col-md-3">'+datas.bachelor+'</li>\n' +
            '                        <li class="col-md-5">同比增长 '+datas.bachelorOnYear+'</li>\n' +
            '                    </div>\n' +
            '                    <div class="count-item">\n' +
            '                        <li class="col-md-4">专科人数</li>\n' +
            '                        <li class="col-md-3">'+datas.specialized+'</li>\n' +
            '                        <li class="col-md-5">同比增长 '+datas.specializedOnYear+'</li>\n' +
            '                    </div>\n' +
            '                    <div class="count-item">\n' +
            '                        <li class="col-md-4">总体人数</li>\n' +
            '                        <li class="col-md-3">'+datas.enrolment+'</li>\n' +
            '                        <li class="col-md-5">同比增长 '+datas.enrolmentOnYear+'</li>\n' +
            '                    </div>\n' +
            '                </ul>\n' +
            '                <div class="col-md-5 row">\n' +
            '                    <ul class="gender row">\n' +
            '                        <li class="rate">\n' +
            '                            <img src="./images/man.png" alt="">\n' +
            '                            <div class="count">\n' +
            '                                <div class="man" style="width: '+datas.maleAccount+';">'+datas.maleAccount+'</div>\n' +
            '                            </div>\n' +
            '                            <div class="red">同比增长 '+datas.maleOnYear+'</div>\n' +
            '                        </li>\n' +
            '                        <li class="rate" style="margin-top: 10px;">\n' +
            '                            <img src="./images/woman.png" alt="">\n' +
            '                            <div class="count">\n' +
            '                                <div class="woman" style="width: '+datas.femaleAccount+';">'+datas.femaleAccount+'</div>\n' +
            '                            </div>\n' +
            '                            <div class="red">同比增长 '+datas.femaleOnYear+'</div>\n' +
            '                        </li>\n' +
            '                    </ul>\n' +
            '                </div>')
    }

    /*
   图四 中国地图
    */
    function chinaDetail(data, time) {
        var datas = [], areaName = [
            {name: '北京'},
            {name: '天津'},
            {name: '上海'},
            {name: '重庆'},
            {name: '河北'},
            {name: '河南'},
            {name: '云南'},
            {name: '辽宁'},
            {name: '黑龙江'},
            {name: '湖南'},
            {name: '安徽'},
            {name: '山东'},
            {name: '新疆'},
            {name: '江苏'},
            {name: '浙江'},
            {name: '江西'},
            {name: '湖北'},
            {name: '广西'},
            {name: '甘肃'},
            {name: '山西'},
            {name: '内蒙古'},
            {name: '陕西'},
            {name: '吉林'},
            {name: '福建'},
            {name: '贵州'},
            {name: '广东'},
            {name: '青海'},
            {name: '西藏'},
            {name: '四川'},
            {name: '宁夏'},
            {name: '海南'},
            {name: '台湾'},
            {name: '香港'},
            {name: '澳门'}
        ], china = [];
        data.forEach(function (xn,xi) {
            xn.data.forEach(function (yn,yi) {
                yn.year == time ? datas.push(yn) : '';
            })
        });
        var block = false; //后台返回的数据，不够34个省份，所以需要校验一下，没有的数据填0
        areaName.forEach(function (xn,xi) {
            block = false;
            datas.forEach(function (yn, yi) {
                if(yn.province == xn.name){
                    block = true;
                    china.push({name: yn.province, value: yn.num,above5Hundred:yn.above5Hundred,above6Hundred:yn.above6Hundred})
                }
                if(yi == datas.length-1 && block == false){
                    china.push({name: xn.name, value: 0,above5Hundred:0,above6Hundred:0})
                }
            })
        });
        var option = {
            tooltip : {//提示框组件。
                show: true,
                trigger: 'item',
                backgroundColor:'#000',
                formatter: function (data) {
                    return data.data.name +'<br/>招生人数：'+data.data.value +'<br/>500分以上：'+data.data.above5Hundred +'<br/>600分以上：'+data.data.above6Hundred;
                }
            },
            layoutSize: 400,
            visualMap: {//颜色的设置  dataRange
                x: 'left',
                y: 'center',
                text:[0,1000],// 文本，默认为数值文本
                color: ['#e0ffff', '#006edd']
            },
            dataRange: {
                orient: 'horizontal',
                min: 0,
                max: 100,
                text:['高','低'],           // 文本，默认为数值文本
                color: ['#006edd', '#e0ffff'],
                textStyle: {
                    color: '#fff', // 值域文字颜色
                    fontSize: 15
                }
            },
            series : [
                {
                    name: '全国招生详情',
                    type: 'map',
                    mapType: 'china',
                    mapLocation: {
                        x: 'left'
                    },
                    zoom: 1.2,
                    selectedMode : 'multiple',
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data: china
                },
            ]
        };
        var chart = echarts.init(document.getElementById('china-detail'));
        chart.setOption(option);

        autohover();
        function autohover(data){
            var count = 0;
            var timeTicket = null;
            var dataLength = 34;//此处设置的是需要轮播的次数
            timeTicket && clearInterval(timeTicket);
            timeTicket = setInterval(function() {
                chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,

                });
                chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: (count) % dataLength
                });
                chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: (count) % dataLength
                });
                count++;
            }, 2000);
        }
    }

});
