var express = require('express');
var router = express.Router();
const Temp = require('../models/temperature');




router.get("/oneDayOfData/:Date", function(req, res){
    var date  = new Date(req.params.Date);
    let timeStamp1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let timeStamp2 = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
    console.log(timeStamp1);
    console.log(timeStamp2);
    let data = {
        "high-temp":"",
        "low-temp":"",
        "avg-temp":"",
        "high-hum":"",
        "low-hum":"",
        "avg-hum":""
      }
    Temp.find({referenceTime:{"$gte": timeStamp2 , "$lt": timeStamp1 }}, function(err, hightemp){
        if(hightemp[0] == undefined){
            data['high-temp'] = "no data"
        }else{
            data['high-temp'] = hightemp[0].temperature;
        }
        
        Temp.find({referenceTime:{"$gte": timeStamp2 , "$lt": timeStamp1 }}, function(err, lowtemp){
            if(lowtemp[0] == undefined){
                data['low-temp'] = "no data";
            }else{
                data['low-temp'] = lowtemp[0].temperature;
            }
            
            Temp.find({referenceTime:{"$gte": timeStamp2 , "$lt": timeStamp1 }}, function(err, highhum){

                if(highhum[0] == undefined){
                    data['high-hum'] = "no data";
                }else{  
                    data['high-hum'] = highhum[0].humidity;
                }
                
                Temp.find({referenceTime:{"$gte": timeStamp2 , "$lt": timeStamp1 }}, function(err, lowhum){
                    if(lowhum[0] == undefined){
                        data['low-hum'] = "no data";
                    }else{
                        data['low-hum'] = lowhum[0].humidity;
                    }
                    
                    Temp.find({referenceTime:{"$gte": timeStamp2 , "$lt": timeStamp1 }}, function(err, avg){
                        if(avg[0] == undefined){
                            data['avg-temp'] = "no data";
                            data['avg-hum'] = "no data";
                        }else{
                            let tempSum = 0;
                            let tempAvg = 0;
                            let humSum = 0;
                            let humAvg = 0;
                            for(let i=0;i<avg.length;i++){
                                tempSum = tempSum + parseInt(avg[i].temperature);
                                humSum = humSum + parseInt(avg[i].humidity);
                            }
                            tempAvg = tempSum/avg.length;
                            humAvg = humSum/avg.length;
                            data['avg-temp'] = tempAvg;
                            data['avg-hum'] = humAvg;
                            console.log("test");
                            
                        }
                        res.status(201).json(data);
                    
                    });
                }).sort({"humidity":+1}).limit(1);
            }).sort({"humidity":-1}).limit(1);
        }).sort({"temperature":+1}).limit(1);
    }).sort({"temperature":-1}).limit(1);
    
});

router.post("/24hours", function(req, res){
    var data = {
        "high-temp":"",
        "low-temp":"",
        "avg-temp":"",
        "high-hum":"",
        "low-hum":"",
        "avg-hum":""
      }
    let today = new Date();
    let oneDayBefore = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1, today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds());
    Temp.find({referenceTime:{"$gte": oneDayBefore , "$lt": today }}, function(err, hightemp){
        if(hightemp[0] == undefined){
            data['high-temp'] = "no data";
        }else{
            data['high-temp'] = hightemp[0].temperature;
        }
        
        
        Temp.find({referenceTime:{"$gte": oneDayBefore , "$lt": today }}, function(err, lowtemp){
            if(lowtemp[0] == undefined){
                data['low-temp'] = "no data"
            }else{
                data['low-temp'] = lowtemp[0].temperature;
            }
            Temp.find({referenceTime:{"$gte": oneDayBefore , "$lt": today }}, function(err, highhum){
                if(highhum[0] == undefined){
                    data['high-hum'] = "no data";
                }else{
                    data['high-hum'] = highhum[0].humidity;
                }
                Temp.find({referenceTime:{"$gte": oneDayBefore , "$lt": today }}, function(err, lowhum){
                    if(lowhum[0] == undefined){
                        data['low-hum'] = "no data";
                    }else{
                        data['low-hum'] = lowhum[0].humidity;
                    }
                    
                    Temp.find({referenceTime:{"$gte": oneDayBefore , "$lt": today }}, function(err, avg){
                        if(avg[0] == undefined){
                            data['avg-temp'] = "no data";
                            data['avg-hum'] = "no data";
                        }else{
                            let tempSum = 0;
                            let tempAvg = 0;
                            let humSum = 0;
                            let humAvg = 0;
                            for(let i=0;i<avg.length;i++){
                                tempSum = tempSum + parseInt(avg[i].temperature);
                                humSum = humSum + parseInt(avg[i].humidity);
                            }
                            tempAvg = tempSum/avg.length;
                            humAvg = humSum/avg.length;
                            data['avg-temp'] = tempAvg;
                            data['avg-hum'] = humAvg;
                            
                        }   
                        res.status(201).json(data);
                    
                    });
                }).sort({"humidity":+1}).limit(1);
            }).sort({"humidity":-1}).limit(1);
        }).sort({"temperature":+1}).limit(1);
    }).sort({"temperature":-1}).limit(1);
    
});

router.post("/hourly", function(req, res){
    var hourly = {
        "temp":{
            "now":"",
            "4-hours-ago":"",
            "8-hours-ago":"",
            "12-hours-ago":"",
            "16-hours-ago":"",
            "20-hours-ago":"",
            "24-hours-ago":""
        },
        "hum":{
            "now":"",
            "4-hours-ago":"",
            "8-hours-ago":"",
            "12-hours-ago":"",
            "16-hours-ago":"",
            "20-hours-ago":"",
            "24-hours-ago":""
        }
        
    }

    let current = new Date();
    Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, now){
        if(now[0] == undefined){
            hourly.temp.now = "no data";
            hourly.hum.now = "no data";
        }else{
            hourly.temp.now = now[0].temperature;
            hourly.hum.now = now[0].humidity;
        }
        Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-4, current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-4, current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, fourHours){
            if(fourHours[0] == undefined){
                hourly.temp['4-hours-ago'] = "no data";
                hourly.hum['4-hours-ago'] = "no data";
            }else{
                hourly.temp['4-hours-ago'] = fourHours[0].temperature;
                hourly.hum['4-hours-ago'] = fourHours[0].humidity;
            }
            Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-8, current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-8, current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, eightHours){
                if(eightHours[0] == undefined){
                    hourly.temp['8-hours-ago'] = "no data";
                    hourly.hum['8-hours-ago'] = "no data";
                }else{
                    hourly.temp['8-hours-ago'] = eightHours[0].temperature;
                    hourly.hum['8-hours-ago'] = eightHours[0].humidity;
                }
                Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-12, current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-12, current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, twelveHours){
                    if(twelveHours[0] == undefined){
                        hourly.temp['12-hours-ago'] = "no data";
                        hourly.hum['12-hours-ago'] = "no data";
                    }else{
                        hourly.temp['12-hours-ago'] = twelveHours[0].temperature;
                        hourly.hum['12-hours-ago'] = twelveHours[0].humidity;
                    }
                    Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-16, current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-16, current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, sixteenHours){
                        if(sixteenHours[0] == undefined){
                            hourly.temp['16-hours-ago'] = "no data";
                            hourly.hum['16-hours-ago'] = "no data";
                        }else{
                            hourly.temp['16-hours-ago'] = sixteenHours[0].temperature;
                            hourly.hum['16-hours-ago'] = sixteenHours[0].humidity;
                        }
                        Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-20, current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-20, current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, twentyHours){
                            if(twentyHours[0] == undefined){
                                hourly.temp['20-hours-ago'] = "no data";
                                hourly.hum['20-hours-ago'] = "no data";
                            }else{
                                hourly.temp['20-hours-ago'] = twentyHours[0].temperature;
                                hourly.hum['20-hours-ago'] = twentyHours[0].humidity;
                            }
                            Temp.find({referenceTime:{"$gte": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-24, current.getMinutes()-10, current.getSeconds(), current.getMilliseconds()) , "$lt": new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours()-24, current.getMinutes()+10, current.getSeconds(), current.getMilliseconds()) }}, function(err, twentyFourHours){
                                if(twentyFourHours[0] == undefined){
                                    hourly.temp['24-hours-ago'] = "no data";
                                    hourly.hum['24-hours-ago'] = "no data";
                                    
                                }else{
                                    hourly.temp['24-hours-ago'] = twentyFourHours[0].temperature;
                                    hourly.hum['24-hours-ago'] = twentyFourHours[0].humidity;
                                }
                                res.status(201).json(hourly);
                                
                            }).sort().limit(1);
                        }).sort().limit(1);
                    }).sort().limit(1);
                }).sort().limit(1);
            }).sort().limit(1);
        }).sort().limit(1);
    }).sort().limit(1);
    
});




  module.exports = router;