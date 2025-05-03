// FeatureCards.vue
<template>
  <div class="feature-cards-section">
    <div class="translator-header">
        <h3>Qo'shimcha imkoniyatlar</h3>
      </div>
      <div class="card">
        <div class="icon-container-fu">
          <div class="icon-fu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>
        <div class="content-fu">
          <h2 class="title-fu">To'liq lug'at</h2>
          <p class="description-fu">
            Barcha shevalar lug'atlarini ko'rib chiqing va yangi so'zlarni o'rganing.
          </p>
          <div class="button-container-fu">
            <button class="button-fu">
              <span>Lug'atga o'tish</span>
              <span class="icon-arrow-fu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </button>
          </div>
      </div>
    </div>
    <div class="card">
        <div class="icon-container-fu">
          <div class="icon-fu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
            stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
        <div class="content-fu">
          <h2 class="title-fu">Shevalar xaritasi</h2>
          <p class="description-fu">
          O'zbekiston hududlaridagi shevalar tarqalishini xaritada ko'ring.
          </p>
          <div class="button-container-fu">
            <button class="button-fu">
              <span>Xaritaga o'tish</span>
              <span class="icon-arrow-fu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </button>
          </div>
      </div>
    </div>

    <div class="card">
        <div class="icon-container-fu">
          <div class="icon-fu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
            </svg>
          </div>
        </div>
        <div class="content-fu">
          <h2 class="title-fu">API dasturlash</h2>
          <p class="description-fu">
            Dasturchilar uchun API orqali lug'at ma'lumotlariga kirish imkoniyati.
          </p>
          <div class="button-container-fu">
            <button class="button-fu">
              <span>API haqida</span>
              <span class="icon-arrow-fu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </button>
          </div>
      </div>
    </div>
  </div>
</template>