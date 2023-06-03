package com.did.result;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author lisihan
 */
@JsonIgnoreProperties
@Data
public class PageResult<T> implements Serializable{
    private List<T> records;
    private Boolean succeed;
    private String message;
    private long totalElements;
    private long currentPage;
    private long pageSize;
    private long totalPages;
    private int numberOfElements;

    public PageResult() {
    }

    public PageResult(Page<T> page) {
        this.succeed = true;
        this.message = "成功";
        this.records = page.getRecords();
        this.totalElements = page.getTotal();
        this.currentPage = page.getCurrent();
        this.pageSize = page.getSize();
        this.numberOfElements = page.getRecords().size();
        this.totalPages = page.getPages();
    }

    public PageResult(Page<T> page, String message) {
        this.succeed = true;
        this.message = message;
        this.records = page.getRecords();
        this.totalElements = page.getTotal();
        this.currentPage = page.getCurrent();
        this.pageSize = page.getSize();
        this.numberOfElements = page.getRecords().size();
        this.totalPages = page.getPages();
    }

//    public Boolean getSucceed() {
//        return this.succeed;
//    }
//
//    public void setSucceed(Boolean succeed) {
//        this.succeed = succeed;
//    }
//
//    public void setCurrentPage(long currentPage) {
//        this.currentPage = currentPage;
//    }
//
//    public void setPageSize(long pageSize) {
//        this.pageSize = pageSize;
//    }
//
//    public void setTotalPages(long totalPages) {
//        this.totalPages = totalPages;
//    }
//
//    public String getMessage() {
//        return this.message;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }
//
//    public boolean hasPrevious() {
//        return this.getCurrentPage() > 0L;
//    }
//
//    public boolean hasNext() {
//        return this.getCurrentPage() + 1L < this.getTotalPages();
//    }
//
//    public long getTotalPages() {
//        return this.totalPages;
//    }
//
//    public List<T> getRecords() {
//        return Collections.unmodifiableList(this.records);
//    }
//
//    public void setRecords(List<T> records) {
//        this.records = records;
//    }
//
//    public boolean hasRecords() {
//        return this.getNumberOfElements() > 0;
//    }
//
//    public Long getPageSize() {
//        return this.pageSize;
//    }
//
//    public void setPageSize(Long pageSize) {
//        this.pageSize = pageSize;
//    }
//
//    public long getTotalElements() {
//        return this.totalElements;
//    }
//
//    public void setTotalElements(long totalElements) {
//        this.totalElements = totalElements;
//    }
//
//    public Long getCurrentPage() {
//        return this.currentPage;
//    }
//
//    public void setCurrentPage(Long currentPage) {
//        this.currentPage = currentPage;
//    }
//
//    public int getNumberOfElements() {
//        return this.numberOfElements;
//    }
//
//    public void setNumberOfElements(int numberOfElements) {
//        this.numberOfElements = numberOfElements;
//    }

}
