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
    <div id="overlay" v-show="showContent">
      <div id="content">
        <template
          v-for="data in resData"
          :key="data.id">
          <div class="modelItem">
            <input type="checkbox" v-model="test" @click="testchk(data)">
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

    <div id="app" style="display: flex; justify-content: space-around;">
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
            <h2>{{ item.description }}</h2>
          </div>
        </div>
      </template>
    </div>

  </main>

</template>

<script>

// イメージ
// youtubeから取得したデータをmysqlに保存
// mysqlに保存してあるデータをvueで表示
// 検索かけて追加もできるように
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios'


export default {
    
    setup() {
        
        // youtubeurl
        // vは取得したvideoIdを入れる
        const youtubeUrl = 'https://www.youtube.com/watch?v='

        const requestYoutube = ref('')
        const searchWord = ref('')

        // youtubeから取得したデータを格納
        let resData = reactive([])

        // mysqlに格納用
        let sendData = reactive([])

        let test = reactive([]);

        // モーダル制御用
        const showContent = ref(false);

        // dbからのデータ格納
        const items = reactive([]);
        
        // youtubedataapiのパラメータ
        const params = {
          q: "", // クエリ
          part: "snippet",
          type: "video",
          maxResults: "20", 
          key: "***"
        }

        const sendItem = ref('')

        // 取得したデータの値を取得
        const testchk = (a) => {
            sendData.push({ id: a.id, title: a.title, img: a.img, description: a.description, time: a.time })
        };

        const check = () => {
            console.log(searchWord);
        };

        // フィルタリング処理
        const search = computed(() => {
            return items.filter(item => {
                return item.title.includes(searchWord.value)  
            })
            
        });

        // モーダル表示
        const openModal = () => {
          showContent.value = true;
        };

        // モーダル非表示
        const closeModal = () => {
          showContent.value = false;
        };

        // dbからデータ取得
        const getData = onMounted(() => {
            axios
                  .get('http://localhost:3000/')
                  .then(function (response) {
                      for(let b=0;b<response.data.length;b++){
                        let tmpData2 = reactive({ id: response.data[b].id,
                                                  title: response.data[b].title,
                                                  img: response.data[b].img,
                                                  description: response.data[b].description,
                                                  time: response.data[b].time 
                                                })
                        items[b] = tmpData2
                        //console.log(response.data.length)
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
                console.log(resData)
              });
        }

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
            
        return {
            requestYoutube,
            searchWord,
            resData,
            sendData,
            getData,
            showContent,
            test,
            params,
            items,
            sendItem,
            search,
            testchk,
            searchYoutube,
            openModal,
            closeModal,
            check,
            insertData
        };
    },
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
