// 初始化酒店表格
function initHotelTable() {
    $('#hotelTable').bootstrapTable({
        url: '/hotel/list',
        method: 'get',
        pagination: true,
        sidePagination: 'client',
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        showFooter: false,
        search: false,
        showRefresh: true,
        showToggle: true,
        showColumns: true,
        showPaginationSwitch: true,
        queryParams: function(params) {
            // 获取查询参数
            var hotelName = $('#searchHotelName').val();
            var cityId = $('#searchCity').val();
            var chainId = $('#searchChainId').val();
            
            // 构建查询参数对象，只包含非空值
            var searchParams = {};
            if (hotelName && hotelName.trim() !== '') {
                searchParams.hotelName = hotelName.trim();
            }
            if (cityId && cityId.trim() !== '') {
                searchParams.cityId = cityId.trim();
            }
            if (chainId && chainId.trim() !== '') {
                searchParams.chainId = chainId.trim();
            }
            
            console.log('查询参数:', searchParams);
            return searchParams;
        },
        formatRecordsPerPage: function(pageNumber) {
            return '每页显示 ' + pageNumber + ' 条记录';
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
            return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';
        },
        icons: {
            refresh: 'fas fa-sync',
            toggleOff: 'fas fa-list',
            toggleOn: 'fas fa-table',
            columns: 'fas fa-columns',
            paginationSwitchDown: 'fas fa-caret-square-down',
            paginationSwitchUp: 'fas fa-caret-square-up'
        },
        columns: [{
            field: 'hotelName',
            title: '酒店名称',
            align: 'left'
        }, {
            field: 'chainName',
            title: '所属集团',
            align: 'left'
        }, {
            field: 'address',
            title: '地址',
            align: 'left'
        }, {
            field: 'cityName',
            title: '城市',
            align: 'left'
        }, {
            field: 'operate',
            title: '操作',
            class: 'operate-column',
            width: 90,
            formatter: operateFormatter,
            align: 'center'
        }]
    });
}

// 加载集团列表
function loadChains() {
    $.ajax({
        url: '/chain/list',
        type: 'GET',
        success: function(data) {
            var chainSelect = $('#chainId');
            var searchChainSelect = $('#searchChainId');
            
            // 清空现有选项
            chainSelect.empty();
            searchChainSelect.empty();
            
            // 添加默认选项
            chainSelect.append('<option value="">请选择集团</option>');
            searchChainSelect.append('<option value="">选择集团</option>');
            
            // 添加集团选项
            if (data && data.length > 0) {
                data.forEach(function(chain) {
                    chainSelect.append('<option value="' + chain.chainId + '">' + chain.chainName + '</option>');
                    searchChainSelect.append('<option value="' + chain.chainId + '">' + chain.chainName + '</option>');
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('加载集团数据失败:', error);
        }
    });
}

// 加载城市列表
function loadCities() {
    $.ajax({
        url: '/city/list',
        type: 'GET',
        success: function(data) {
            var citySelect = $('#city');
            var searchCitySelect = $('#searchCity');
            
            // 清空现有选项
            citySelect.empty();
            searchCitySelect.empty();
            
            // 添加默认选项
            citySelect.append('<option value="">请选择城市</option>');
            searchCitySelect.append('<option value="">选择城市</option>');
            
            // 添加城市选项
            if (data && data.length > 0) {
                data.forEach(function(city) {
                    var option = '<option value="' + city.cityId + '">' + city.cityName + '</option>';
                    citySelect.append(option);
                    searchCitySelect.append(option);
                });
            }
            
            // 刷新Select2
            citySelect.trigger('change');
            searchCitySelect.trigger('change');
        },
        error: function(xhr, status, error) {
            console.error('加载城市数据失败:', error);
        }
    });
}

// 搜索酒店
function searchHotels() {
    // 获取查询参数
    var hotelName = $('#searchHotelName').val();
    var cityId = $('#searchCity').val();
    var chainId = $('#searchChainId').val();
    
    // 构建查询参数对象，只包含非空值
    var params = {};
    if (hotelName && hotelName.trim() !== '') {
        params.hotelName = hotelName.trim();
    }
    if (cityId && cityId.trim() !== '') {
        params.cityId = cityId.trim();
    }
    if (chainId && chainId.trim() !== '') {
        params.chainId = chainId.trim();
    }
    
    console.log('搜索参数:', params);
    
    // 刷新表格数据
    $('#hotelTable').bootstrapTable('refresh', {
        url: '/hotel/list',
        query: params
    });
}

// 显示添加酒店模态框
function showAddHotelModal() {
    $('#hotelId').val('');
    $('#hotelForm')[0].reset();
    $('#chainId').val('');
    $('#city').val('');
    $('#modalTitle').text('新增酒店');
    $('#hotelModal').modal('show');
}

// 编辑酒店
function editHotel(hotelId) {
    // 重置表单
    $('#hotelForm')[0].reset();
    $('#chainId').val('').trigger('change');
    $('#city').val('').trigger('change');
    
    $.ajax({
        url: '/hotel/' + hotelId,
        type: 'GET',
        success: function(data) {
            console.log('编辑酒店数据:', data);
            $('#modalTitle').text('编辑酒店');
            $('#hotelId').val(data.hotelId);
            $('#hotelName').val(data.hotelName);
            $('#address').val(data.address);
            $('#city').val(data.cityId).trigger('change');
            $('#country').val(data.country);
            $('#contactEmail').val(data.contactEmail);
            $('#contactPhone').val(data.contactPhone);
            
            if (data.chainId) {
                $('#chainId').val(data.chainId).trigger('change');
            }
            
            $('#hotelModal').modal('show');
        },
        error: function(xhr, status, error) {
            console.error('获取酒店数据失败:', error);
        }
    });
}

// 保存酒店
function saveHotel() {
    var hotelId = $('#hotelId').val();
    var selectedCityId = $('#city').val();
    var url = hotelId ? '/hotel/' + hotelId : '/hotel';
    var method = hotelId ? 'PUT' : 'POST';
    
    var hotel = {
        hotelId: hotelId,
        hotelName: $('#hotelName').val(),
        chainId: $('#chainId').val(),
        address: $('#address').val(),
        cityId: selectedCityId,
        country: $('#country').val(),
        contactEmail: $('#contactEmail').val(),
        contactPhone: $('#contactPhone').val()
    };

    console.log('保存酒店数据:', hotel);

    $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        data: JSON.stringify(hotel),
        success: function() {
            $('#hotelModal').modal('hide');
            $('#hotelTable').bootstrapTable('refresh');
        },
        error: function(xhr, status, error) {
            console.error('保存酒店失败:', error);
            alert('保存失败，请检查数据是否完整');
        }
    });
}

// 删除酒店
function deleteHotel(hotelId) {
    if (confirm('确定要删除该酒店吗？')) {
        $.ajax({
            url: '/hotel/' + hotelId,
            type: 'DELETE',
            success: function() {
                $('#hotelTable').bootstrapTable('refresh');
            }
        });
    }
}

// 格式化操作列
function operateFormatter(value, row, index) {
    return [
        '<button class="btn btn-xs btn-edit" onclick="editHotel(\'' + row.hotelId + '\')" title="编辑">',
        '<i class="fas fa-edit"></i>',
        '</button>',
        '<button class="btn btn-xs btn-delete" onclick="deleteHotel(\'' + row.hotelId + '\')" title="删除">',
        '<i class="fas fa-trash"></i>',
        '</button>'
    ].join('');
}

// 页面加载完成后初始化
$(document).ready(function() {
    initHotelTable();
    loadChains();
    loadCities();
    
    // 初始化 Select2
    $('#searchChainId, #chainId').select2({
        placeholder: '选择集团',
        allowClear: true,
        language: {
            noResults: function() {
                return '没有找到匹配的集团';
            },
            searching: function() {
                return '搜索中...';
            }
        }
    });

    // 初始化城市选择的Select2
    $('#searchCity, #city').select2({
        placeholder: '选择城市',
        allowClear: true,
        language: {
            noResults: function() {
                return '没有找到匹配的城市';
            },
            searching: function() {
                return '搜索中...';
            }
        }
    });

    // 为模态框中的Select2设置父容器
    $('#city').select2({
        dropdownParent: $('#hotelModal')
    });
}); 