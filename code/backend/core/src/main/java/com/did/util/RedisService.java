package com.did.util;

/**
 * @author lisihan
 * @Description redis工具接口
 * @date 2022/4/12-19:25
 */
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface RedisService {
    void set(String var1, Object var2, long var3);

    void set(String var1, Object var2);

    Object get(String var1);

    Boolean del(String var1);

    Long del(List<String> var1);

    Boolean expire(String var1, long var2);

    Long getExpire(String var1);

    Boolean hasKey(String var1);

    Long incr(String var1, long var2);

    Long decr(String var1, long var2);

    Object hGet(String var1, String var2);

    Boolean hSet(String var1, String var2, Object var3, long var4);

    void hSet(String var1, String var2, Object var3);

    Map<Object, Object> hGetAll(String var1);

    Boolean hSetAll(String var1, Map<String, Object> var2, long var3);

    void hSetAll(String var1, Map<String, Object> var2);

    void hDel(String var1, Object... var2);

    Boolean hHasKey(String var1, String var2);

    Long hIncr(String var1, String var2, Long var3);

    Long hDecr(String var1, String var2, Long var3);

    Set<Object> sMembers(String var1);

    Long sAdd(String var1, Object... var2);

    Long sAdd(String var1, long var2, Object... var4);

    Boolean sIsMember(String var1, Object var2);

    Long sSize(String var1);

    Long sRemove(String var1, Object... var2);

    List<Object> lRange(String var1, long var2, long var4);

    Long lSize(String var1);

    Object lIndex(String var1, long var2);

    Long lPush(String var1, Object var2);

    Long lPush(String var1, Object var2, long var3);

    Long lPushAll(String var1, Object... var2);

    Long lPushAll(String var1, Long var2, Object... var3);

    Long lRemove(String var1, long var2, Object var4);
}
