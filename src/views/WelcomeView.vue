<template>
    <div class="welcome">
        <h1>欢迎您进入</h1>
        <h1>白酒数据库后台管理系统</h1>
        <div class="stats">
            <p>酒诗数量(朝代): <span>{{ poemsbydynastyCount }}</span></p>
            <p>酒诗数量(地点): <span>{{ poemsbylocationCount }}</span></p>
            <p>酒画数量: <span>{{ poemimagesCount }}</span></p>
            <p>酒器数量: <span>{{ vesselCount }}</span></p>
            <p>注册用户数量: <span>{{ userCount }}</span></p>
        </div>
    </div>
</template>

<script>
import request from '@/api/request';
export default {
    data() {
        return {
            poemimagesCount: 0,
            poemsbylocationCount: 0,
            poemsbydynastyCount:0,
            vesselCount: 0,
            userCount: 0
        };
    },
    mounted() {
        this.fetchStats();
    },
    methods: {
        fetchStats() {
            request.get(`count/api/gettotal`).then(res => {
                console.log(res)
                this.vesselCount = res.data.vesselCount;
                this.poemimagesCount = res.data.poemimagesCount;
                this.poemsbydynastyCount = res.data.poemsbydynastyCount;
                this.poemsbylocationCount = res.data.poemsbylocationCount;
                this.userCount = res.data.userCount;
                })
                .catch(error => console.error('Error fetching stats:', error));
        }
    }
}
</script>

<style>

h1 {
    font-size: 80px;
    text-align: center;
}

.stats {
    text-align: center;
    margin-top: 20px;
}

.stats p {
    font-size: 29px;
    color: #333;
}

.stats span {
    font-weight: bold;
    color: #007BFF;
}
</style>
