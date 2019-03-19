
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
            url: 'js/data.json',
            //url: 'http://202.201.156.92:8080/screen/enrollinfo/detail',
            success: function (data) {
                var year = [], index = 0;
                data.enrollDetails.forEach(function (n,i) {
                    year.push(n.year);
                });
                stackingBar(data.enrollNationConstitutes);
                nationType(data.enrollNationConstitutes,2015);
                pieDetail(data.enrollDetails,2015);
                enrollmentType(data.enrollTypeDetails,2015);

                var timer = setInterval(function () {
                    var clock = index % year.length;
                    //各学院招生详情
                    pieDetail(data.enrollDetails,year[clock]);
                    //招生类型详情
                    enrollmentType(data.enrollTypeDetails,year[clock]);
                    //全校学生民族构成
                    nationType(data.enrollNationConstitutes,year[clock]);
                    $('.head .fr').html(year[clock]+'年');
                    index ++;
                },68000);
            }
        })

    })();
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
