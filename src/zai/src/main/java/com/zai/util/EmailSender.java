package com.zai.util;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;
import java.io.File;
import org.springframework.stereotype.Component;

@Component
public class EmailSender {

    public static void main(String[] args) {
        // 初始化EmailSender，指定SMTP服务器信息
        EmailSender emailSender = new EmailSender();

        // 多个收件人、抄送人和密件抄送人
        String[] toEmails = {"jianzhou@homeinns.com,cus@win-on.net"};
        String[] ccEmails = null;
        String[] bccEmails = null;

        // 发送普通文本格式的邮件
        boolean textEmailResult = emailSender.sendTextEmail(toEmails, ccEmails, bccEmails, "Test Subject", "This is a plain text email.");
        System.out.println("Text Email sent: " + textEmailResult);

        // 发送HTML格式的邮件
        //String htmlContent = "<h1>This is an HTML Email</h1><p>with some <b>bold</b> text.</p>";
        //boolean htmlEmailResult = emailSender.sendHTMLEmail(toEmails, ccEmails, bccEmails, "HTML Email Subject", htmlContent);
        //System.out.println("HTML Email sent: " + htmlEmailResult);

        // 发送带附件的HTML格式邮件
        //boolean attachmentEmailResult = emailSender.sendEmailWithAttachment(toEmails, ccEmails, bccEmails, "Email with Attachment", htmlContent, "/path/to/attachment.txt");
        //System.out.println("Email with Attachment sent: " + attachmentEmailResult);
    }



    private final String host="smtp.126.com";
    private final String port="465";//25
    private final String username="zhxm528@126.com";
    private final String password="UTQjnu9dVqVVYH6f";//2024-09-25申请，180有效
    private final Session session;

    // 构造函数，初始化SMTP服务器信息
    public EmailSender() {

        // 配置邮件服务器的属性
        Properties properties = new Properties();
        properties.put("mail.smtp.host", this.host);
        properties.put("mail.smtp.port", this.port);
        properties.put("mail.smtp.auth", "true");
        //properties.put("mail.smtp.starttls.enable", "true");  // 启用TLS

        // 启用 SSL
        properties.put("mail.smtp.socketFactory.port", port);
        properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        properties.put("mail.smtp.socketFactory.fallback", "false");

        // 创建认证信息
        Authenticator auth = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        };

        // 创建会话
        this.session = Session.getInstance(properties, auth);
    }

    // 发送普通文本格式的邮件，支持多个收件人、抄送和密件抄送
    public boolean sendTextEmail(String[] toEmails, String[] ccEmails, String[] bccEmails, String subject, String body) {
        try {
            Message message = prepareMessage(toEmails, ccEmails, bccEmails, subject, body);
            Transport.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 发送HTML格式的邮件，支持多个收件人、抄送和密件抄送
    public boolean sendHTMLEmail(String[] toEmails, String[] ccEmails, String[] bccEmails, String subject, String htmlBody) {
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            setRecipients(message, toEmails, ccEmails, bccEmails);
            message.setSubject(subject);

            // 设置HTML格式的正文
            message.setContent(htmlBody, "text/html");

            Transport.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 发送带附件且支持HTML格式的邮件，支持多个收件人、抄送和密件抄送
    public boolean sendEmailWithAttachment(String[] toEmails, String[] ccEmails, String[] bccEmails, String subject, String htmlBody, String filePath) {
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            setRecipients(message, toEmails, ccEmails, bccEmails);
            message.setSubject(subject);

            // 创建HTML正文部分
            MimeBodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setContent(htmlBody, "text/html");

            // 创建用于附件的MimeBodyPart
            MimeBodyPart attachmentPart = new MimeBodyPart();
            attachmentPart.attachFile(new File(filePath));

            // 创建多部分内容
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);  // 添加正文
            multipart.addBodyPart(attachmentPart);   // 添加附件

            // 设置邮件内容为多部分
            message.setContent(multipart);

            Transport.send(message);
            return true;
        } catch (MessagingException | java.io.IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 私有方法，用于准备普通邮件消息
    private Message prepareMessage(String[] toEmails, String[] ccEmails, String[] bccEmails, String subject, String body) throws MessagingException {
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        setRecipients(message, toEmails, ccEmails, bccEmails);
        message.setSubject(subject);
        message.setText(body);
        return message;
    }

    // 私有方法，设置多个收件人、抄送人和密件抄送人
    private void setRecipients(Message message, String[] toEmails, String[] ccEmails, String[] bccEmails) throws MessagingException {
        if (toEmails != null && toEmails.length > 0) {
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(String.join(",", toEmails)));
        }
        if (ccEmails != null && ccEmails.length > 0) {
            message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(String.join(",", ccEmails)));
        }
        if (bccEmails != null && bccEmails.length > 0) {
            message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(String.join(",", bccEmails)));
        }
    }
}

