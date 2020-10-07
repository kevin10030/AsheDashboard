


var Index = function () {
    var protocol = location.protocol === "https:" ? "wss:" : "ws:";
    var uri = protocol + "//" + window.location.host + "/ws";
    var $tblAlert = null;
    var connection = new WebSocketManager(uri);

    $(function () {
        $(".selectable-li").click(function () {            
            if ($(this).find("input")[0].checked === true) {
                $(this).find("input").attr("checked", false);

            } else {
                $(this).find("input").attr("checked", true);
            }
            var i = 0;
            var locations = [];
            var deviceTypes = [];
            $(".location-checkbox").each(function () {
                if ($(this)[0].checked === true) {
                    locations[i] = $(this).val();
                    i++;
                }
            });
            i = 0;
            $(".device-type-checkbox").each(function () {
                if ($(this)[0].checked === true) {
                    deviceTypes[i] = $(this).val();
                    i++;
                }
            });

            $(".user-ul").empty();
            $.ajax({
                type: 'GET',
                url: '/home/getFilteredResult',
                dataType: 'JSON',
                data: { 'locations': locations.join(), 'deviceTypes': deviceTypes.join() },
                success: function (xhr, status, response) {

                    //console.log(response);
                    var user_device_str = "";
                    var j = 0;
                    xhr.Users.forEach(User => {
                        j++;
                        user_device_str += '<li class="has- children" >';
                        user_device_str += '<input type="checkbox" name="sub-group-4-' + j + '" id="sub-group-4-' + j + '" value="' +User.id+'">';
                        user_device_str += '<label for="sub-group-4-' + j + '" style="margin-bottom:0px">';
                        user_device_str += User.userName;
                        user_device_str += '</label>';
                        user_device_str += '<ul class="user-device-ul">';                        
                        var jj = 0;
                        xhr.Devices.forEach(Device => {
                            if (Device.userId === User.id)
                            {
                                jj++;
                                user_device_str += '<li class="has-children" style="margin-bottom:0px">';
                                user_device_str += '<input type="checkbox" name="sub-group-4-' + j + '-' + jj + '" id="sub-group-4-' + j + '-' + jj + '" >';
                                user_device_str += '<label for="sub-group-4-' + j + '-' + jj + '" style="line-height: 6px; margin-bottom: 0px !important; "> <input type="checkbox" class="inner_checkbox device-checkbox" style="margin-top: -2px !important;" value="' + Device.id + '" />' + Device.imei + '</label>';
                                user_device_str += '<ul class="' + Device.imei + '">';
                                for (var jjj = 1; jjj <=6; jjj++) {
                                    Device.sensors.forEach(Sensor => {
                                        if (Sensor.relayMapping === jjj) {
                                            if (Sensor.status === 0) {
                                                user_device_str += '<li class="sensor-checkbox-li" sensor-num="' + Sensor.sensorTypeId + '" id="sensor-' + Device.imei + '-' + jjj + '" style="line-height: 6px; margin-bottom: 0px !important; ">';
                                                user_device_str += '<a href="#0"><input type="checkbox" class="inner_checkbox sensor-checkbox" style="margin-top: -1px !important;" name="sub-group-4-' + j + '-' + jj + '-' + jjj + '" id="sub-group-4-' + j + '-' + jj + '-' + jjj + '" device-imei="' + Device.imei + '" sensor-type-id="' + Sensor.sensorTypeId + '" sensor-relay-mapping="' + jjj + '" value="' + Sensor.id + '" /> R<h>' + jjj + '</h><span><img src="/images/off_icon.png" alt="" /> Turn Off</span></a>';
                                                user_device_str += '</li >';
                                            } else {
                                                user_device_str += '<li class="sensor-checkbox-li" sensor-num="' + Sensor.sensorTypeId + '" id="sensor-' + Device.imei + '-' + jjj + '" style="line-height: 6px; margin-bottom: 0px !important; ">';
                                                user_device_str += '<a href="#0"><input type="checkbox" class="inner_checkbox sensor-checkbox" style="margin-top: -1px !important;" name="sub-group-4-' + j + '-' + jj + '-' + jjj + '" id="sub-group-4-' + j + '-' + jj + '-' + jjj + '" device-imei="' + Device.imei + '" sensor-type-id="' + Sensor.sensorTypeId + '" sensor-relay-mapping="' + jjj + '" value="' + Sensor.id + '" checked/> R<h>' + jjj + '</h><span><img src="/images/on_icon.png" alt="" /> Turn On</span></a>';
                                                user_device_str += '</li >';
                                            }
                                        }
                                    });
                                }
                                user_device_str += '</ul >';
                                user_device_str += '</li >';
                            }
                        });
                        user_device_str += '</ul >';
                        user_device_str += '</li >';
                    });

                    $(".user-ul").html(user_device_str);

                    /*
                    var data = "863921030312808,date,time,GPIO3_ON,OK";

                    var res = data.split(",");
                    if (res[4] == "OK") {
                        var imei = res[0];
                        var status = res[3].split("_");
                        var relay_mapping = status[0][4];
                        var jjj = $("#sensor-" + imei + "-" + relay_mapping).attr("sensor-num").valueOf();
                        $("#sensor-" + imei + "-" + relay_mapping).html("");
                        var content = "";
                        if (status[1] == "OFF") {
                            content = '<a href="#0"><input type="checkbox" class="inner_checkbox sensor-checkbox" style="margin-top: -1px !important;" device-imei="' + res[0] + '" sensor-relay-mapping="' + relay_mapping + '" /> R<h>' + jjj + '</h><span><img src="/images/off_icon.png" alt="" /> Turn Off</span></a>';
                        } else {
                            content = '<a href="#0"><input type="checkbox" class="inner_checkbox sensor-checkbox" style="margin-top: -1px !important;" device-imei="' + res[0] + '" sensor-relay-mapping="' + relay_mapping + '" checked/> R<h>' + jjj + '</h><span><img src="/images/on_icon.png" alt="" /> Turn On</span></a>';
                        }
                        $("#sensor-" + imei + "-" + relay_mapping).html(content);
                    }
                    */
                }

            });
        });        
    });

    $(document).on("click", ".device-checkbox", function (event) {
        showAllAlerts();
    });

    $(document).on("click", ".sensor-checkbox-li", function (e) {
        var val = $(this).find("input").val();
        var device_imei = $(this).find("input").attr("device-imei").valueOf();
        var sensor_relay_mapping = $(this).find("input").attr("sensor-relay-mapping").valueOf();
        var command = device_imei + ",GPIO" + sensor_relay_mapping;

        if ($(this).find("input")[0].checked === true) {
            $(this).find("input").attr("checked", false);            
            //alert("Relay Off (" + device_imei + " " + sensor_relay_mapping + ")");            
            command += "_OFF";
        } else {
            $(this).find("input").attr("checked", true);
            //alert("Relay On (" + device_imei + " " + sensor_relay_mapping + ")");
            command += "_ON";
        }        

        connection.invokeOnly("SendMessage", 'string', command);

/*        $.ajax({
            type: 'GET',
            url: '/home/relayonoff',
            data: { 'command': command },
            success: function (xhr, status, response) {
               
            }
        });*/

    });

    //group realy on
    $('#relay_on').click(function () {
        var i = 0;
        var sensors = [];
        $(".sensor-checkbox").each(function () {
            if ($(this)[0].checked === true) {
                sensors[i] = $(this).val();
                i++;
            }
        });

        alert("Group Relay On (" + sensors.join() + ")");
        
        socket.send(JSON.stringify({
            to: "relay_on",
            data: sensors.join()
        }));
    });
    //group realy off
    $('#relay_off').click(function () {
        var i = 0;
        var sensors = [];
        $(".sensor-checkbox").each(function () {
            if ($(this)[0].checked === true) {
                sensors[i] = $(this).val();
                i++;
            }
        });

        alert("Group Relay Off (" + sensors.join() + ")");
        socket.send(JSON.stringify({
            to: "relay_off",
            data: sensors.join()
        }));


    });

    var addNewAlert = function (packet) {
        
        $tblAlert
            .rows(function (idx, data, node) {
                return data.imei === packet.IMEI;
            })
            .remove()
            .draw();

        $('#pressure_value').text(packet.SensorValue1);  //xhr.log.sensorValue1
        $('#temperature_value').text(packet.SensorValue2);
        $('#humidity_value').text(packet.SensorValue3);
        $('#moisture_value').text(packet.SensorValue4);
        $('#liquid_value').text(packet.SensorValue5);
        $('#co2_value').text(packet.SensorValue6);

        var Device = packet.Device;
        var sensorValue = "";
        for (var i = 0; i < Device.Sensors.length; i++) {
            var str = Device.Sensors[i].RelayMapping + "_0";
            for (var j = 0; j < packet.Alerts.length; j++) {
                if (Device.Sensors[i].RelayMapping === packet.Alerts[j].Sensor.RelayMapping) {
                    str = Device.Sensors[i].RelayMapping + "_1";
                    break;
                }
            }
            sensorValue += str + " ";
        }                      

        var row = {
            DT_RowId: packet.Id, // alert.Id,
            index: 1,
            location: Device.Location.Name !== null ? Device.Location.Name : '', //packet.Alerts[0].Sensor.Device,
            imei: packet.IMEI,
            user: Device.User.UserName,
            timestamp: packet.Timestamp,
            sensorValue: sensorValue,
            relay: packet.SensorStatus1 + " " + packet.SensorStatus2 + " " + packet.SensorStatus3 + " " + packet.SensorStatus4 + " " + packet.SensorStatus5 + " " + packet.SensorStatus6
        };
        prepend(row);
        
    };
    
    var prepend = function (row) {
        $tblAlert.row.add(row);
        var aiDisplayMaster = $tblAlert.settings()[0]["aiDisplayMaster"];
        irow = aiDisplayMaster.pop();
        aiDisplayMaster.unshift(irow);
        $tblAlert.draw();
    };

    var showAlertDetail = function (id) {
        $.ajax({
            type: 'GET',
            url: '/home/alert?id=' + id,
            success: function (xhr, status, response) {
                $('#pressure_value').text(xhr.sensorValue1);  //xhr.log.sensorValue1
                $('#temperature_value').text(xhr.sensorValue2);
                $('#humidity_value').text(xhr.sensorValue3);
                $('#moisture_value').text(xhr.sensorValue4);
                $('#liquid_value').text(xhr.sensorValue5);
                $('#co2_value').text(xhr.sensorValue6);
            }
        });
    };
    
    var showAllAlerts = function () {
        
        var i = 0;
        var devices = [];
        $(".device-checkbox").each(function () {
            if ($(this)[0].checked === true) {
                devices[i] = $(this).val();
                i++;
            }
        });
        $.ajax({
            type: 'GET',
            url: '/home/alertfordevices',
            data: { 'devices': devices.join() },
            success: function (xhr, status, response) {

                $tblAlert.clear().draw();
                for (var i in xhr) {
                    var Device = xhr[i];
                    if (Device.Logs.length == 0) continue;
                    var Log = Device.Logs[Device.Logs.length - 1];

                    var sensorValue = "";
                    var relayValue = "";//Log.SensorStatus1 + " " + Log.SensorStatus2 + " " + Log.SensorStatus3 + " " + Log.SensorStatus4 + " " + Log.SensorStatus5 + " " + Log.SensorStatus6
                    var relayValue1 = "", relayValue2 = "", relayValue3 = "", relayValue4 = "", relayValue5 = "", relayValue6 = "";
                    //Device.Sensors.sort(function (a, b) { return a.sensorTypeId - b.sensorTypeId });
                    for (var k = 0; k < Device.Sensors.length; k++) {
                        switch (Device.Sensors[k].RelayMapping)
                        {
                            case 1: relayValue1 = Device.Sensors[k].Status; break;
                            case 2: relayValue2 = Device.Sensors[k].Status; break;
                            case 3: relayValue3 = Device.Sensors[k].Status; break;
                            case 4: relayValue4 = Device.Sensors[k].Status; break;
                            case 5: relayValue5 = Device.Sensors[k].Status; break;
                            case 6: relayValue6 = Device.Sensors[k].Status; break;
                        }                            

                        var str = Device.Sensors[k].RelayMapping + "_0";
                        for (var j = 0; j < Log.Alerts.length; j++) {
                            if (Device.Sensors[k].RelayMapping === Log.Alerts[j].Sensor.RelayMapping) {
                                str = Device.Sensors[k].RelayMapping + "_1";
                                break;
                            }
                        }
                        sensorValue += str + " ";
                    }

                    relayValue = relayValue1 + " " + relayValue2 + " " + relayValue3 + " " + relayValue4 + " " + relayValue5 + " " + relayValue6;
                    

                    var row = {
                        DT_RowId: Log.Id,
                        index: null,
                        location: Device.Location.Name !== null ? Device.Location.Name : '',
                        imei: Device.IMEI,
                        user: Device.User.UserName,
                        timestamp: Log.Timestamp,//alert.Log.Timestamp,
                        sensorValue: sensorValue,
                        //sensorValue: Device.Sensors[0].RelayMapping + " " + Device.Sensors[1].RelayMapping + " " + Device.Sensors[2].RelayMapping + " " + Device.Sensors[3].RelayMapping + " " + Device.Sensors[4].RelayMapping + " " + Device.Sensors[5].RelayMapping,
                        relay: relayValue
                    };
                    prepend(row);
                }
            },
            error: function (jqXHR, exception) {
                //alert("get location(home) failed");
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                    Index.getLocationName(packet);
                } else if (jqXHR.status === 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status === 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
            }
        });
        
    };

    

    return {
        init: function () {
            $.fn.DataTable.ext.pager.numbers_length = 5;
            $tblAlert = $('#tblAlert').DataTable({
                select: true,
                lengthMenu: [5],
                columns: [
                    { data: "index" },
                    { data: "location" },
                    { data: "imei" },
                    { data: "user" },
                    { data: "timestamp" },
                    {
                        data: "sensorValue",
                         render: function (data, type, row) {
                            var res = data.split(" ");
                            var str = "";
                            for (var i = 0; i < 5; i++) {
                                var res1 = res[i].split("_");
                                if (res1[1] === '0') {
                                    str += '<font size="3" color="black">' + res1[0] + '&nbsp&nbsp&nbsp</font>';
                                } else {
                                    str += '<font size="3" color="red">' + res1[0] +'&nbsp&nbsp&nbsp</font>';
                                }                                
                            }
                            res1 = res[5].split("_");
                            if (res1[1] === '0') {
                                str += '<font size="3" color="black">' + res1[0] + '</font>';
                            } else {
                                str += '<font size="3" color="red">' + res1[0] + '</font>';
                            }                                
                            return str;
                        }
                    },
                    {
                        data: "relay",
                        render: function (data, type, row) {
                            
                            var res = data.split(" ");
                            var sensorRes = row.sensorValue.split(" ");
                            var str = "";
                            for (var i = 0; i < 5; i++) {
                                var sensorRes1 = sensorRes[i].split("_");
                                if (res[i] === '1')
                                    str += '<img class="img_on" data-num="'+i+'" data-imei="' + row.imei + '" data-value="' + sensorRes1[0] +'" src="/images/on_icon.png" width=20 height=20 alt=""/>&nbsp';
                                else str += '<img class="img_off" data-num="' + i +'" data-imei="' + row.imei + '" data-value="' + sensorRes1[0] +'" src="/images/off_icon.png" width=20 height=20 alt=""/>&nbsp';
                            }
                            sensorRes1 = sensorRes[5].split("_");
                            if (res[5] === '1')
                                str += '<img class="img_on" data-num="' + i +'" data-imei="' + row.imei + '" data-value="' + sensorRes1[0] +'" src="/images/on_icon.png" width=20 height=20 alt=""/>';
                            else str += '<img class="img_off" data-num="' + i +'" data-imei="' + row.imei + '" data-value="' + sensorRes1[0] +'" src="/images/off_icon.png" width=20 height=20 alt=""/>';
                            
                            return str;
                        }
                    }
                ]
            });

            $tblAlert.on('select', function (e, dt, type, indexes) {
                var id = $tblAlert.row(indexes[0]).id();
                showAlertDetail(id);
            });

            $tblAlert.on('order.dt search.dt', function () {
                $tblAlert.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();

            $tblAlert.on("click", ".img_on", function (e) {
                e.stopPropagation();
                var imei = $(this).data('imei');
                var relayMapping = $(this).data('value');
               /* var sensorTypeId = relayMapping;
                $tblAlert.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var data = this.data();
                    if (data.imei == imei) {
                        var res = data.relay.split(" ");
                        res[sensorTypeId - 1] = "0";
                        var str = "";
                        for (var i = 0; i < 6; i++) {
                            str += res[i] + " ";
                        }
                        data.relay = str;
                        data.index = rowIdx + 1;
                        this.data(data)
                    }                    
                })
                */
                var command = imei + ",GPIO" + relayMapping + "_OFF";
//                alert(command);
                connection.invokeOnly("SendMessage", 'string', command);
            });

            $tblAlert.on("click", ".img_off", function (e) {
                e.stopPropagation();                

                var imei = $(this).data('imei');
                var relayMapping = $(this).data('value');
              /*  var sensorTypeId = relayMapping;
                $tblAlert.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var data = this.data();
                    if (data.imei == imei) {
                        var res = data.relay.split(" ");
                        res[sensorTypeId - 1] = "1";
                        var str = "";
                        for (var i = 0; i < 6; i++) {
                            str += res[i] + " ";
                        }
                        data.relay = str;
                        data.index = rowIdx + 1;
                        this.data(data)
                    }
                })*/

                var command = imei + ",GPIO" + relayMapping + "_ON";
//                alert(command);
                connection.invokeOnly("SendMessage", 'string', command);
            });

            showAllAlerts();

           
        },
        getLocationName: function (packet) {
            $.ajax({
                type: 'GET',
                url: '/home/getLocationNamesTask',
                success: function (xhr, status, response) {
                    //alert("get location(home) ok");
                    //window.location.reload(false); 
                    addNewAlert(packet);
                },
                error: function (jqXHR, exception) {
                    //alert("get location(home) failed");
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                        Index.getLocationName(packet);
                    } else if (jqXHR.status === 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status === 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                }
            });
        },
        connect: function () {
            
            // optional.
            // called when the connection has been established together with your id.
            connection.onConnected = (id) => {
            };

            // optional.
            // called when the connection to the server has been lost.
            connection.onDisconnected = () => {
            };

            // optional.
            // called when some plain-text message has been received.
            connection.onMessage = (text) => {
                if (text.indexOf("is connected") !== -1 || text.indexOf("is disconnected") !== -1) {
                    alert(text);
                } else {
                    var packet = JSON.parse(text);
                    addNewAlert(packet);
                    Index.getLocationName(packet);
                }
            };

            connection.methods.receiveMessage = (userid, text) => {
                //T633L packet
                if (text.indexOf("$$") !== -1 || text.indexOf("24-24-") !== -1 || text.indexOf("\r\n") !== -1 || text.indexOf("-0D-0A") !== -1) {
                   
                } else {
                    alert(userid + " said: " + text);
                }
                //imei,date,time,GPIO1_state,OK
                var res = text.split(",");
                if (res.length > 4 && res[4].indexOf("OK") !== -1) {
                    
                    var imei = res[0];
                    var status = res[3].split("_");
                    var jjj = status[0][4];
                    var sensorTypeId = $("#sensor-" + imei + "-" + jjj).attr("sensor-num").valueOf();
                    $("#sensor-" + imei + "-" + jjj).html("");
                    var content = "";
                    if (status[1] === "OFF") {
                        content = '<a href="#0"><input type="checkbox" class="inner_checkbox sensor-checkbox" style="margin-top: -1px !important;" device-imei="' + res[0] + '" sensor-relay-mapping="' + jjj + '" /> R<h>' + jjj + '</h><span><img src="/images/off_icon.png" alt="" /> Turn Off</span></a>';
                    } else {
                        content = '<a href="#0"><input type="checkbox" class="inner_checkbox sensor-checkbox" style="margin-top: -1px !important;" device-imei="' + res[0] + '" sensor-relay-mapping="' + jjj + '" checked/> R<h>' + jjj + '</h><span><img src="/images/on_icon.png" alt="" /> Turn On</span></a>';
                    }
                    $("#sensor-" + imei + "-" + jjj).html(content);     

                    //datatable relay status update
                    $tblAlert.rows().every(function (rowIdx, tableLoop, rowLoop) {
                        var data = this.data();
                        if (data.imei === imei) {
                            var res = data.relay.split(" ");
                            if (status[1] === "OFF")
                                res[sensorTypeId - 1] = "0";
                            else res[sensorTypeId - 1] = "1";
                            var str = "";
                            for (var i = 0; i < 6; i++) {
                                str += res[i] + " ";
                            }
                            data.relay = str;
                            data.index = rowIdx + 1;
                            this.data(data)
                        }
                    })
                }

            };

            // establish a connection to the server.
            connection.connect();

            /*
            socket = new WebSocket(uri);
            socket.open = function (event) {
                console.log("opened connection to " + uri);
            };
            socket.onclose = function (event) {
                //alert(event.code);
                console.log("closed connection from" + uri);
            };
            socket.onmessage = function (event) {
                console.log(event.data);

                var packet = JSON.parse(event.data);
                addNewAlert(packet);
            };
            socket.onerror = function (event) {
                console.log("error: " + event.data);
            };
            */
        }
    };
}();

jQuery(document).ready(function() {
    Index.init();
    Index.connect();    
});