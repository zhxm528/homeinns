// 格式化日期时间
function formatDateTime(date) {
    if (!date) return '';
    return new Date(date).toLocaleString();
}

// 显示成功消息
function showSuccess(message) {
    alert(message);
}

// 显示错误消息
function showError(message) {
    alert('错误：' + message);
}

// 显示确认对话框
function showConfirm(message, callback) {
    if (confirm(message)) {
        callback();
    }
} 