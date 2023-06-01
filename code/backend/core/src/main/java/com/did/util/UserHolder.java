package com.did.util;


import com.did.entity.User;

/**
 * @author lisihan
 * @Description ThreadLocal
 * @date 2022/11/23-20:41
 */
public class UserHolder {
    private static final ThreadLocal<User> threadLocal = new ThreadLocal<>();

    public static void saveUser(User user){
        threadLocal.set(user);
    }

    public static User getUser(){
        return threadLocal.get();
    }

    public static void removeUser(){
        threadLocal.remove();
    }
}
