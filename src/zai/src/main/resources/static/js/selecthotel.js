/**
 * 酒店选择器功能
 */
class HotelSelector {
    constructor(selectorId) {
        this.selectorId = selectorId;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.init();
    }

    init() {
        console.log('初始化酒店选择器');
        // 确保select元素存在
        const select = $(this.selectorId);
        if (select.length === 0) {
            console.error('未找到select元素:', this.selectorId);
            return;
        }

        // 清空现有选项
        select.empty();
        select.append('<option value="">选择酒店</option>');
        
        // 初始化selectpicker
        select.selectpicker({
            liveSearch: true,
            size: 10,
            noneResultsText: '没有找到匹配的酒店',
            liveSearchPlaceholder: '搜索酒店...',
            width: '200px',
            showTick: false,
            dropupAuto: false,
            mobile: false
        });

        // 加载初始数据
        this.loadHotels();
        this.bindEvents();

        // 添加提示信息
        const hotelSelector = $('.hotel-selector');
        if (hotelSelector.length > 0) {
            hotelSelector.append('<div class="text-muted small mt-1">请选择要操作的酒店</div>');
        }
    }

    loadHotels(isLoadMore = false) {
        if (this.isLoading || (!isLoadMore && !this.hasMore)) {
            return;
        }

        this.isLoading = true;
        console.log('开始加载酒店列表, isLoadMore:', isLoadMore);
        
        const chainId = sessionStorage.getItem('selectedChainId');
        const params = {
            page: isLoadMore ? this.currentPage : 1,
            size: 10,
            chainId: chainId
        };

        console.log('发送请求参数:', params);

        // 如果是初始加载，重置分页状态
        if (!isLoadMore) {
            this.currentPage = 1;
            this.hasMore = true;
        }

        $.ajax({
            url: '/api/hotels/current-chain',
            type: 'GET',
            data: params,
            beforeSend: function(xhr) {
                console.log('发送请求URL:', '/api/hotels/current-chain');
                console.log('请求参数:', params);
            },
            success: (response) => {
                console.log('收到酒店列表响应:', response);
                if (response.success && response.data) {
                    const hotels = response.data;
                    console.log('解析到的酒店数据数量:', hotels.length);
                    console.log('解析到的酒店数据:', hotels);
                    
                    const select = $(this.selectorId);
                    
                    // 只在第一次加载时清空选项
                    if (!isLoadMore) {
                        select.empty();
                        select.append('<option value="">选择酒店</option>');
                    }
                    
                    // 添加酒店选项
                    hotels.forEach((hotel) => {
                        const option = `<option value="${hotel.hotelId}">${hotel.hotelName} (${hotel.cityName || '未知城市'})</option>`;
                        select.append(option);
                    });
                    
                    // 更新分页状态
                    this.hasMore = hotels.length === 10;
                    this.currentPage++;
                    
                    // 刷新selectpicker
                    select.selectpicker('refresh');

                    // 设置默认选中的酒店
                    const savedHotelId = sessionStorage.getItem('selectedHotelId');
                    if (savedHotelId) {
                        select.selectpicker('val', savedHotelId);
                        console.log('已设置保存的酒店ID:', savedHotelId);
                    }
                } else {
                    console.error('加载酒店列表失败:', response);
                }
                this.isLoading = false;
            },
            error: (xhr, status, error) => {
                console.error('加载酒店列表失败:', error);
                console.error('请求状态:', status);
                console.error('响应数据:', xhr.responseText);
                this.isLoading = false;
            }
        });
    }

    bindEvents() {
        console.log('开始绑定事件');
        
        // 酒店选择事件
        $(this.selectorId).off('changed.bs.select').on('changed.bs.select', (e, clickedIndex, isSelected, previousValue) => {
            console.log('酒店选择事件触发');
            const selectedHotelId = $(this.selectorId).val();
            const currentHotelId = sessionStorage.getItem('selectedHotelId');
            
            if (selectedHotelId && selectedHotelId !== currentHotelId) {
                this.updateSelectedHotel(selectedHotelId);
            }
        });

        // 使用事件委托监听滚动事件
        $(document).on('scroll', '.bootstrap-select .dropdown-menu, .bootstrap-select .inner, .bootstrap-select ul.dropdown-menu', (e) => {
            console.log('滚动事件触发于元素:', e.currentTarget);
            console.log('滚动位置:', e.currentTarget.scrollTop);
            console.log('元素高度:', e.currentTarget.scrollHeight);
            console.log('可视区域高度:', e.currentTarget.clientHeight);
            
            // 检查是否滚动到底部
            if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 50) {
                console.log('接近底部，准备加载更多数据');
                this.loadHotels(true);
            }
        });

        // 监听下拉菜单打开事件
        $(this.selectorId).on('shown.bs.select', () => {
            console.log('下拉菜单打开事件触发');
            
            // 等待下拉菜单完全渲染
            setTimeout(() => {
                // 查找所有可能的滚动容器
                const containers = $('.bootstrap-select .dropdown-menu, .bootstrap-select .inner, .bootstrap-select ul.dropdown-menu');
                
                containers.each((index, container) => {
                    console.log(`容器${index}信息:`, {
                        tagName: container.tagName,
                        className: container.className,
                        scrollHeight: container.scrollHeight,
                        clientHeight: container.clientHeight,
                        style: window.getComputedStyle(container)
                    });
                    
                    // 确保容器可滚动
                    $(container).css({
                        'overflow-y': 'auto',
                        'max-height': '300px'
                    });
                });
            }, 100);
        });

        // 监听下拉菜单关闭事件
        $(this.selectorId).on('hidden.bs.select', () => {
            console.log('下拉菜单关闭事件触发');
        });

        console.log('事件绑定完成');
    }

    updateSelectedHotel(hotelId) {
        console.log('更新选中的酒店:', hotelId);
        const currentHotelId = sessionStorage.getItem('selectedHotelId');
        if (hotelId === currentHotelId) {
            console.log('选中的酒店未变化，跳过更新');
            return;
        }

        const selectedOption = $(this.selectorId).find('option:selected');
        const hotelName = selectedOption.text().split('(')[0].trim();

        $.ajax({
            url: '/api/session/hotel',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                hotelId: hotelId,
                hotelName: hotelName 
            }),
            success: (response) => {
                if (response.success) {
                    sessionStorage.setItem('selectedHotelId', hotelId);
                    sessionStorage.setItem('selectedHotelName', hotelName);
                    if (response.data && response.data.chainId) {
                        sessionStorage.setItem('selectedChainId', response.data.chainId);
                    }
                    alert(`已切换到${hotelName}`);
                    $(document).trigger('hotelChanged', [hotelId]);
                } else {
                    console.error('更新选中酒店失败:', response);
                    $(this.selectorId).selectpicker('val', currentHotelId);
                }
            },
            error: (xhr, status, error) => {
                console.error('更新选中酒店失败:', error);
                alert('更新选中酒店失败，请重试');
                $(this.selectorId).selectpicker('val', currentHotelId);
            }
        });
    }
}

// 创建全局实例
const hotelSelector = new HotelSelector('#hotelSelect'); 