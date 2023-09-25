<!-- モータルウィンドウ -->
<template>
  <div id="overlay" v-show="showContent">
    <div id="content">
      <template
        v-for="data in youtubeData"
        :key="data.id">
        <div class="modelItem">
          <input type="checkbox" v-model="dataMotal" @click="setData(data)">
          <img
            :src="data.img"
            alt="">
        </div>
        <div class="title">
          <h2>{{ data.title }}</h2>
        </div>
        <div class="description">
          <h2>{{ data.description }}</h2>
        </div>
      </template>
        <p><button @click="insertData">追加</button></p>
        <p><button @click="closeModal">close</button></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineExpose } from 'vue';
import axios from 'axios'


    // モーダル制御用
    const showContent = ref(false);

    // モーダル非表示
    const closeModal = () => {
      showContent.value = false;
    };

    // youtube格納データ
    let youtubeData = reactive([])

    const getFromApp = defineProps({value: Object});
    
    // 親コンポーネントのモータル制御が実行されるタイミングで実行
    const childMethod = () => {
      showContent.value = true;

      youtubeData = getFromApp.value
    };

    // モータルウィンドウ用
    let dataMotal = reactive([]);

    // mysqlに格納用
    let sendData = reactive([])

    // 取得したデータの値を取得
    const setData = (a) => {
      sendData.push({ id: a.id, title: a.title, img: a.img, description: a.description, time: a.time })
    };

    // dbにデータを挿入
    const insertData = () => {
      axios
        .post("http://localhost:3000/insert", sendData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

    defineExpose({
      childMethod,
    });

</script>