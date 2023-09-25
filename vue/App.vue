<template>
  <header class="header">
    <div>
      <input type="text" v-model="requestYoutube" placeholder="検索" />
      <button @click="searchYoutube(); openModal()">検索</button>
    </div>
    <input type="text" v-model="searchWord" placeholder="フィルタリング" />
  </header>

  <main>

  <!-- モータルウィンドウ -->
    <mortalWindow ref="childData" :value="resData" />

    <div id="app" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, auto)); justify-content: space-around;">
      <template
        v-for="item in search"
        :key="item.id">
        <div class="item">
          <div class="thumbnail">
            <a 
              :href="item.id"
              target="_blank">
              <img
              :src="item.img"
              alt="">
            </a>
          </div>
          <div class="description">
            <h3>{{ item.title }}</h3>
          </div>
        </div>
      </template>
    </div>

  </main>

</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios'
import mortalWindow from './components/mortalWindow.vue'
        
        // youtubeurl
        const youtubeUrl = 'https://www.youtube.com/watch?v='

        const requestYoutube = ref('')
        const searchWord = ref('')

        // youtubeから取得したデータを格納
        let resData = reactive([])

        // dbからのデータ格納
        const items = reactive([]);
        
        // youtubedataapiのパラメータ
        const params = {
          q: "", // クエリ
          part: "snippet",
          type: "video",
          maxResults: "20", 
          key: "****"
        }

        // フィルタリング処理
        const search = computed(() => {
            return items.filter(item => {
                return item.title.includes(searchWord.value)  
            })
            
        });

        // 子コンポーネント受け渡し
        const childData = ref();
        
        // モーダル表示
        const openModal = () => {
          // 子コンポーネント側で実行
          childData.value.childMethod();
        };

        // dbからデータ取得
        onMounted(() => {
            axios
                  .get('http://localhost:3000/')
                  .then(function (response) {
                      for(let b=0;b<response.data.length;b++){
                        let entityTitle = response.data[b].title.replace(/&#39;/g, '‘')
                        let decodeTitle = decodeURIComponent(entityTitle)
                        let tmpData2 = reactive({ id: response.data[b].id,
                                                  title: decodeTitle,
                                                  img: response.data[b].img,
                                                  description: response.data[b].description,
                                                  time: response.data[b].time 
                                                })
                        items[b] = tmpData2
                      }
                  })
                  .catch(function (error) {
                      console.log(error);
                  });
            
        });

        // youtubeからデータ取得
        const searchYoutube = () => {
            params.q = requestYoutube.value;
            axios
              .get("https://www.googleapis.com/youtube/v3/search", {
                params: params
              })
              .then((res) => {
                for(let n=0; n<20; n++){
                  let responseData = res.data.items;

                  let tmpData = reactive({ 
                                     id: youtubeUrl + responseData[n].id.videoId,
                                     time: responseData[n].snippet.publishTime,
                                     title: responseData[n].snippet.title,
                                     description: responseData[n].snippet.description,
                                     img: responseData[n].snippet.thumbnails.medium.url                             
                                  })

                  resData[n] = tmpData
                }
              });
        }
</script>

<style>
#overlay{
  /* 要素を重ねた時の順番 */
  z-index:1;

  /* 画面全体を覆う設定 */
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  overflow:scroll;
  background-color:rgba(0,0,0,0.5);

  /* 画面の中央に要素を表示させる設定 */
  display: flex;
  //align-items: center;
  justify-content: space-around;

}

#content {
  z-index: 2;
  overflow: scroll;
  position: absolute;
  width: 50%;
  padding: 1em;
  background: #fff;
}
</style>
