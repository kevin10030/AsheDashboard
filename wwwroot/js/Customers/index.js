﻿$(document).ready(function () {

    var $dt_customerList = $('table#customer-list').DataTable({
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "order": [[1, 'asc']]
    });

    var $dt_customer_device = $('#customer-device').DataTable({
    });

    $('#customer-list tbody').on('click', 'tr', function (event) {
        $tr = $(event.target).closest("tr");
        var id = $tr.data("id");
        $.ajax({
            type: 'GET',
            url: '/customers/modal?id=' + id,
            success: function (xhr, status, response) {
                if (status == "success") {
                    var tbody_str = "<tr>";
                    tbody_str += "<td>" + xhr.userName + "</td>";
                    tbody_str += "<td>" + xhr.email + "</td>";
                    tbody_str += "<td>" + xhr.address + "</td>";
                    tbody_str += "<td>" + xhr.company + "</td>";
                    tbody_str += "<td>" + xhr.contactPerson + "</td>";
                    tbody_str += "</tr>";

                    $("#customer-detail tbody").html(tbody_str);

                    $dt_customer_device.clear().draw();

                    
                    var devices = xhr.devices;
                    devices.forEach(device => {
                        $dt_customer_device.row.
                            add([
                                null,
                                device.imei,
                                device.simCard,
                                device.location != null ? device.location.name : '',
                                device.deviceType.name,
                                device.status
                            ]).draw(false);
                    });                   
                    
                }
            }
        });
        event.preventDefault();
        $("#detailModal").modal();
    });

    $dt_customerList.on('order.dt search.dt', function () {
        $dt_customerList.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
    
    $dt_customer_device.on('order.dt search.dt', function () {
        $dt_customer_device.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
    
    $('input[type="checkbox"]').on('click', function (event) {
        var $tr = $(event.target).closest("tr");
        var id = $tr.data("id");
        if (event.target.checked) {
            var $tb_customerList = $("table#customer-list");
            var $checked_inputs = $tb_customerList.find("input[type='checkbox']:checked");
            for (var i = 0; i < $checked_inputs.length; i++) {
                if ($checked_inputs[i] == event.target) {
                    continue;
                }
                $checked_inputs[i].checked = false;
            }
        }
        event.stopPropagation();
        $('#rowDelete').click(function () {
            $.ajax({
                type: 'POST',
                url: '/customers/Delete?id=' + id,
                success: function (result) {
                    $dt_customerList.row($tr).remove().draw();
                }
            });
        });
    });

    $('#customers_add').click(function () {
        window.location = "/customers/create";
    });

    $('#customers_edit').click(function () {
        var $tb_customerList = $("table#customer-list");
        var $checked_inputs = $tb_customerList.find("input[type='checkbox']:checked").closest("tr");
        if ($checked_inputs.length == 0) {
            alert("No customer is selected!");
            return;
        }

        var customer_id = $checked_inputs.data("id");
        window.location = "/customers/update/" + customer_id;
    });

    $('#customers_delete').click(function () {
        var $dt_customerList = $("table#customer-list");
        var $checked_inputs = $dt_customerList.find("input[type='checkbox']:checked");
        if ($checked_inputs.length == 0) {
            alert("No customer is selected!");
            return;
        }
        $("#deleteModal").modal();
    });
});