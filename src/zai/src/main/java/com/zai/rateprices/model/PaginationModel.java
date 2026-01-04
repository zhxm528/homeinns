package com.zai.rateprices.model;

/**
 * 分页模型
 */
public class PaginationModel {
    private Integer totalHotels;
    private Integer page;
    private Integer pageSize;
    private Integer totalPages;

    public Integer getTotalHotels() {
        return totalHotels;
    }

    public void setTotalHotels(Integer totalHotels) {
        this.totalHotels = totalHotels;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }
} 