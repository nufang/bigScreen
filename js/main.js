
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
                gradeDetail(data.enrollScores,2015);
                enrollmentDetail(data.enrollSpecialDetails,2015);
                enrollProfessions(data.enrollProfessions,2015);
                pieDetail(data.enrollDetails,2015);
                enrollmentType(data.enrollTypeDetails,2015);
                nationType(data.enrollNationConstitutes,2015);
                chinaDetail(data.enrollNationDetails,2015);
                collegeDetail(data.enrollDetails);
                stackingBar(data.enrollNationConstitutes);
                
                var timer = setInterval(function () {
                    var clock = index % year.length;
                    //各学院招生成绩详情
                    gradeDetail(data.enrollScores,year[clock]);
                    //各专业历年招生详情
                    enrollmentDetail(data.enrollSpecialDetails,year[clock]);
                    //全国招生详情 男女比例
                    enrollProfessions(data.enrollProfessions,year[clock]);
                    //各学院招生详情
                    pieDetail(data.enrollDetails,year[clock]);
                    //招生类型详情
                    enrollmentType(data.enrollTypeDetails,year[clock]);
                    //全校学生民族构成
                    nationType(data.enrollNationConstitutes,year[clock]);
                    //中国地图
                    chinaDetail(data.enrollNationDetails,year[clock]);
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
    图1 各学院招生情况
     */
    function collegeDetail(data) {
        var collegeName = [], collegeData = {}, year = [],series = [];
        data.forEach(function (nx,xi) {
            year.push(nx.year.toString());
            collegeData[year[xi]] = [];
            for(var i=0;i<nx.data.length;i++){
                xi == 0? collegeName.push(nx.data[i].collegeName): '';
                collegeData[year[xi]].push(nx.data[i].num);

            }
        });
        var labelOption = {
            normal: {
                show: true,
                position: 'insideBottom',
                distance: 15,
                align:'left',
                verticalAlign: 'middle',
                rotate: 90,
                formatter: '{c}',
                rich: {
                    name: {
                        textBorderColor: '#fff'
                    }
                }
            }
        };
        for(var key in collegeData){
            series.push( {
                name: key,
                type: 'bar',
                barGap: 0,
                label: labelOption,
                data: collegeData[key]
            })
        }

        var option = {
            color: ['#006699', '#618a8d', '#49b5dc', '#e6a390'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: year,
                padding: [5,100,5,100],
                textStyle: {
                    color: '#fff',
                    fontSize: 15
                },
                itemGap: 40
            },
            xAxis: [
                {
                    type: 'category',
                    data: collegeName,
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    },
                }
            ],
            layoutSize: 200,
            yAxis: [
                {
                    type: 'value',
                    name: '人',
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    },
                }
            ],
            series: series
        };
        var collegeDetail = echarts.init(document.getElementById('college-detail'));
        collegeDetail.setOption(option);
    }

    /*
    图二 各学院招生成绩详情
     */
    function gradeDetail(data,time) {
        var collegeName = [], year = [],collegeData = [];
        data.forEach(function (nx,xi) {
            year.push(nx.year);
            collegeData[year[xi]] = [];
            for(var i=0;i<nx.data.length;i++){
                xi == 0? collegeName.push(nx.data[i].collegeName): '';
                collegeData[year[xi]].push({
                    below1Num: nx.data[i].below1Num,
                    below2Num: nx.data[i].below2Num,
                    below3Num: nx.data[i].below3Num,
                    below4Num: nx.data[i].below4Num,
                    below5Num: nx.data[i].below5Num,
                    below6Num: nx.data[i].below6Num,
                    below7Num: 0,
                });
            }
        });
        var arr = [], index = 0, score = collegeData[time];
        var hours = ['100', '200', '300', '400',  '500', '600', '700'];
        collegeName.forEach(function (xn,xi) {
            hours.forEach(function (yn,yi) {
                arr[index] = [];
                arr[index] = [xi, yi, score[xi]['below'+(yi+1)+'Num']];
                index ++;
            });
        });
        var days = collegeName;
        var option = {
            tooltip: {
                position: 'top'
            },
            color: ['#006699', '#618a8d', '#49b5dc', '#e6a390','#ca8622', '#269db4'],
            title: [],
            singleAxis: [],
            series: []
        };

        echarts.util.each(days, function (day, idx) {
            option.title.push({
                textBaseline: 'middle',
                top: (idx + 0.5) * 100 / 8 + '%',
                text: day,
                textStyle: {
                    color: '#ffffff'
                },
            });
            option.singleAxis.push({
                left: 200,
                type: 'category',
                boundaryGap: false,
                data: hours,
                top: (idx * 100 / 8 + 5) + '%',
                height: (100 / 8 - 10) + '%',
                axisLabel: {
                    interval: 1
                },
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '15'
                    },
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color:'#fff',
                        width:'2'
                    }
                }
            });
            option.series.push({
                singleAxisIndex: idx,
                coordinateSystem: 'singleAxis',
                type: 'scatter',
                data: [],
                symbolSize: function (dataItem) {
                    return dataItem[1] * 0.2;
                }
            });
        });

        echarts.util.each(arr, function (dataItem) {
            option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
        });
        var collegeDetail = echarts.init(document.getElementById('grade-detail'));
        collegeDetail.setOption(option);
    }


    /*
    图三 各专业招生情况
     */
    function enrollmentDetail(data, time) {
        $('#enrollment').html(' <li class="title">专业名称</li>\n' +
            '                        <li class="title">招生人数</li>\n' +
            '                        <li class="title">年度环比</li>\n' +
            '                        <li class="title">专业名称</li>\n' +
            '                        <li class="title">招生人数</li>\n' +
            '                        <li class="title">年度环比</li>');
        var datas = [], arrx = [], arry = [], line = [];
        data.forEach(function (xn,xi) {
            xn.data.forEach(function (yn,yi) {
                yn.year == time ? datas.push(yn) : '';
            })
        });
        datas.forEach(function (n,i) {
            $('#enrollment').append('<li>'+n.collegeName+'</li><li>'+n.num+'</li><li>'+n.sequential+'</li>');
            arrx.push(n.collegeName);
            arry.push(n.num);
            line.push(n.peak);
        });
        $('#enrollment li').length % 2 == 1 ? $('#enrollment').append('<li></li><li></li><li></li>'):'';
        var option = {
            color: ['#3398DB','#39e2e8'],
            legend: {
                data:['各专业招生人数','各专业招生峰值'],
                textStyle: {
                    color: '#fff',
                    fontSize: 15
                },
                itemGap:40
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    name: '学院',
                    data : arrx,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0,
                        rotate:45,
                        margin:20,
                        textStyle:{
                            color:"#fff",
                            fontSize: '15'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2',
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '人',
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    },
                }
            ],

            series : [
                {
                    name:'各专业招生人数',
                    type:'bar',
                    barWidth: '60%',
                    itemStyle: {
                        normal: {
                            color: 'rgba(0,102,153, 0.8)',
                        }
                    },
                    data: arry
                },
                {
                    name:'各专业招生峰值',
                    type:'line',
                    data: line,
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: '#39e2e8',
                        }
                    },
                }
            ]
        };
        var enrollmentDetail = echarts.init(document.getElementById('enrollment-detail'));
        enrollmentDetail.setOption(option);
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
            {name: '澳门'},
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

    /*
    图五 饼图 各学院招生详情
   */
    function pieDetail(data, time) {
        $('#tableCollege').html(' <ul class="table-line">\n' +
            '                                <li class="title">学院名称</li>\n' +
            '                                <li class="title">招生人数</li>\n' +
            '                            </ul>');
        var datas = [];
        data.forEach(function (xn,xi) {
            if(xn.year == time){
                xn.data.forEach(function (yn,yi) {
                    datas.push({value: yn.num,name:yn.collegeName});
                });
            }
        });
        datas.forEach(function (n,i) {
            $('#tableCollege').append(' <ul class="table-line">\n' +
                '                                <li>'+n.name+'</li>\n' +
                '                                <li>'+n.value+'</li>\n' +
                '                            </ul>')
        });
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: ['#006699', '#618a8d', '#49b5dc', '#e6a390','#ca8622', '#269db4','#d48265','#f3e82a','#39e2e8'],

            layoutSize: 200,

            calculable : true,
            series : [
                {
                    name:'面积模式',
                    type:'pie',
                    roseType : 'area',
                    data: datas,
                    itemStyle: {
                        normal: {
                            label: {
                                textStyle: {
                                    fontSize: 15
                                }
                            }
                        }
                    }
                }
            ]
        };
        var pieDetail = echarts.init(document.getElementById('pie-detail'));
        pieDetail.setOption(option);

    }

    /*
    图六  曲线柱状图混合
     */
    function enrollmentType(data, time) {
        var collegeName = [], bachelor = [], bachelorAccount = [], special = [], specialAccount=[];
        data.forEach(function (xn,xi) {
            if(xn.year == time){
                xn.data.forEach(function (yn,yi) {
                    collegeName.push(yn.collegeName);
                    bachelor.push(yn.bachelor);
                    yn.bachelorAccount == null ? bachelorAccount.push(0): bachelorAccount.push(yn.bachelorAccount.replace("%",""));
                    special.push(yn.special);
                    yn.specialAccount == null ? specialAccount.push(0): specialAccount.push(yn.specialAccount.replace("%",""));
                });
            }
        });
        var option = {
            color: ['#006699', '#618a8d', '#49b5dc', '#e6a390','#ca8622', '#269db4','#d48265','#f3e82a','#39e2e8'],
            legend: {
                data:['本科人数','专科人数','本科所占比例','专科所占比例'],
                textStyle: {
                    color: '#fff',
                    fontSize: 15
                },
                itemGap:40
            },
            xAxis: [
                {
                    type: 'category',
                    data: collegeName,
                    axisLabel: {
                        interval:0,
                        rotate:45,
                        margin:10,
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '人',
                    min: 0,
                    max: 400,
                    interval: 100,
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '%',
                    min: 0,
                    max: 100,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    }
                }
            ],
            series: [
                {
                    name:'本科人数',
                    type:'bar',
                    data:bachelor
                },
                {
                    name:'专科人数',
                    type:'bar',
                    data:special
                },
                {
                    name:'本科所占比例',
                    type:'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data:bachelorAccount,
                    itemStyle: {
                        normal: {
                            width: 3
                        }
                    }
                },
                {
                    name:'专科所占比例',
                    type:'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: specialAccount,
                    itemStyle: {
                        normal: {
                            width: 3
                        }
                    }
                }
            ]
        };

        var enrollmentType = echarts.init(document.getElementById('enrollment-type'));
        enrollmentType.setOption(option);
    }

    /*
   图六  民族组成饼图
    */
    function nationType(data, time) {
        var nation = [];
        data.forEach(function (xn,xi) {
            if(xn.year == time){
                xn.data.forEach(function (yn,yi) {
                   nation.push({name: yn.national, value: yn.num})
                });
            }
        });
        var option = {
            color: ['#006699', '#618a8d', '#49b5dc', '#e6a390','#ca8622', '#269db4','#d48265','#f3e82a','#39e2e8'],

            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '民族构成',
                    type: 'pie',
                    radius : '70%',
                    center : ['50%', '65%'],
                    data: nation,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            label: {
                                textStyle: {
                                    fontSize: 15
                                }
                            }
                        }
                    }
                }
            ]
        };
        var nationType = echarts.init(document.getElementById('nation-type'));
        nationType.setOption(option);
    }

    /*
    图七  堆叠图
   */
    function stackingBar(data) {
        var national = [], collegeData = {}, year = [],series = [];
        data.forEach(function (nx,xi) {
            year.push(nx.year.toString());
            collegeData[year[xi]] = [];
            for(var i=0;i<nx.data.length;i++){
                xi == 0? national.push(nx.data[i].national): '';
                collegeData[year[xi]].push(nx.data[i].num);
            }
        });
        var itemStyle = {
            //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
            emphasis: {
                barBorderRadius: 30
            },

            normal: {
                //柱形图圆角，初始化效果
                barBorderRadius:[5, 5, 5, 5],
                label: {
                    show: true,//是否展示
                    textStyle: {
                        fontWeight:'bolder',
                        fontSize : '15',
                        fontFamily : '微软雅黑',
                    }
                }
            }
        }
        for(var key in collegeData){
            series.push({
                name: key,
                type:'bar',
                stack: 'national',
                data: collegeData[key],
                itemStyle: itemStyle

            })
        }

        var option = {
            color: ['#006699', '#618a8d', '#49b5dc', '#e6a390','#ca8622', '#269db4','#d48265','#f3e82a','#39e2e8'],

            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: year,
                padding: [5,100,5,100],
                textStyle: {
                    color: '#fff',
                    fontSize: 15
                },
                itemGap: 40
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : national,
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '人',
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff',
                            fontSize: '15'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color:'#fff',
                            width:'2'
                        }
                    },
                }
            ],

            series : series
        };
        var stackingBar = echarts.init(document.getElementById('stacking-bar'));
        stackingBar.setOption(option);
    }

})
