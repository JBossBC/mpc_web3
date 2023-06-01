package com.did.util;

/**
 * @author lisihan
 * @Description redis实现类
 * @date 2022/4/12-19:25
 */

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class RedisServiceImpl implements RedisService {
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    public RedisServiceImpl() {
    }

    public void set(String key, Object value, long time) {
        this.redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
    }

    public void set(String key, Object value) {
        this.redisTemplate.opsForValue().set(key, value);
    }

    public Object get(String key) {
        return this.redisTemplate.opsForValue().get(key);
    }

    public Boolean del(String key) {
        return this.redisTemplate.delete(key);
    }

    public Long del(List<String> keys) {
        return this.redisTemplate.delete(keys);
    }

    public Boolean expire(String key, long time) {
        return this.redisTemplate.expire(key, time, TimeUnit.SECONDS);
    }

    public Long getExpire(String key) {
        return this.redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    public Boolean hasKey(String key) {
        return this.redisTemplate.hasKey(key);
    }

    public Long incr(String key, long delta) {
        return this.redisTemplate.opsForValue().increment(key, delta);
    }

    public Long decr(String key, long delta) {
        return this.redisTemplate.opsForValue().increment(key, -delta);
    }

    public Object hGet(String key, String hashKey) {
        return this.redisTemplate.opsForHash().get(key, hashKey);
    }

    public Boolean hSet(String key, String hashKey, Object value, long time) {
        this.redisTemplate.opsForHash().put(key, hashKey, value);
        return this.expire(key, time);
    }

    public void hSet(String key, String hashKey, Object value) {
        this.redisTemplate.opsForHash().put(key, hashKey, value);
    }

    public Map<Object, Object> hGetAll(String key) {
        return this.redisTemplate.opsForHash().entries(key);
    }

    public Boolean hSetAll(String key, Map<String, Object> map, long time) {
        this.redisTemplate.opsForHash().putAll(key, map);
        return this.expire(key, time);
    }

    public void hSetAll(String key, Map<String, Object> map) {
        this.redisTemplate.opsForHash().putAll(key, map);
    }

    public void hDel(String key, Object... hashKey) {
        this.redisTemplate.opsForHash().delete(key, hashKey);
    }

    public Boolean hHasKey(String key, String hashKey) {
        return this.redisTemplate.opsForHash().hasKey(key, hashKey);
    }

    public Long hIncr(String key, String hashKey, Long delta) {
        return this.redisTemplate.opsForHash().increment(key, hashKey, delta);
    }

    public Long hDecr(String key, String hashKey, Long delta) {
        return this.redisTemplate.opsForHash().increment(key, hashKey, -delta);
    }

    public Set<Object> sMembers(String key) {
        return this.redisTemplate.opsForSet().members(key);
    }

    public Long sAdd(String key, Object... values) {
        return this.redisTemplate.opsForSet().add(key, values);
    }

    public Long sAdd(String key, long time, Object... values) {
        Long count = this.redisTemplate.opsForSet().add(key, values);
        this.expire(key, time);
        return count;
    }

    public Boolean sIsMember(String key, Object value) {
        return this.redisTemplate.opsForSet().isMember(key, value);
    }

    public Long sSize(String key) {
        return this.redisTemplate.opsForSet().size(key);
    }

    public Long sRemove(String key, Object... values) {
        return this.redisTemplate.opsForSet().remove(key, values);
    }

    public List<Object> lRange(String key, long start, long end) {
        return this.redisTemplate.opsForList().range(key, start, end);
    }

    public Long lSize(String key) {
        return this.redisTemplate.opsForList().size(key);
    }

    public Object lIndex(String key, long index) {
        return this.redisTemplate.opsForList().index(key, index);
    }

    public Long lPush(String key, Object value) {
        return this.redisTemplate.opsForList().rightPush(key, value);
    }

    public Long lPush(String key, Object value, long time) {
        Long index = this.redisTemplate.opsForList().rightPush(key, value);
        this.expire(key, time);
        return index;
    }

    public Long lPushAll(String key, Object... values) {
        return this.redisTemplate.opsForList().rightPushAll(key, values);
    }

    public Long lPushAll(String key, Long time, Object... values) {
        Long count = this.redisTemplate.opsForList().rightPushAll(key, values);
        this.expire(key, time);
        return count;
    }

    public Long lRemove(String key, long count, Object value) {
        return this.redisTemplate.opsForList().remove(key, count, value);
    }
}
