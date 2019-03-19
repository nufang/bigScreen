
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
                collegeDetail(data.enrollDetails);
                gradeDetail(data.enrollScores,2015);
                enrollmentDetail(data.enrollSpecialDetails,2015);

                var timer = setInterval(function () {
                    var clock = index % year.length;
                    //各学院招生成绩详情
                    gradeDetail(data.enrollScores,year[clock]);
                    //各专业历年招生详情
                    enrollmentDetail(data.enrollSpecialDetails,year[clock]);
                    $('.head .fr').html(year[clock]+'年');
                    index ++;
                },68000);
            }
        });

    })();
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
                        rotate: 30,
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



})
