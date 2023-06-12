package com.luomacode.chatmoss;


import com.intellij.ui.jcef.JBCefApp;
import com.intellij.ui.jcef.JBCefBrowser;
import com.luomacode.chatmoss.utils.HttpUtils;
import org.apache.commons.lang3.StringUtils;

import javax.swing.*;
import java.awt.*;

/**
 * web加载器
 *
 * @author wangsen
 * @since 2023/3/13 20:17
 */
public class MyWebToolWindowContent {

    private final JPanel content;

    /**
     * 构造函数
     */
    public MyWebToolWindowContent() {
        this.content = new JPanel(new BorderLayout());
        // 判断所处的IDEA环境是否支持JCEF
        if (!JBCefApp.isSupported()) {
            this.content.add(new JLabel("当前环境不支持JCEF", SwingConstants.CENTER));
            return;
        }
        // 创建 JBCefBrowser
        JBCefBrowser jbCefBrowser = new JBCefBrowser();
        // 将 JBCefBrowser 的UI控件设置到Panel中
        this.content.add(jbCefBrowser.getComponent(), BorderLayout.CENTER);
        // 先调接口拿地址
//        String newUrl = HttpUtils.sendGet("https://service-l78wcyp6-1306191308.hk.apigw.tencentcs.com/release/");
        String newUrl= "";
        System.out.println(newUrl);
        if (StringUtils.isBlank(newUrl)) {
            // 默认地址
            newUrl = "http://localhost:3000";
        }
        // 加载URL
        jbCefBrowser.loadURL(newUrl);
    }

    /**
     * 返回创建的JPanel
     * @return JPanel
     */
    public JPanel getContent() {
        return content;
    }
}