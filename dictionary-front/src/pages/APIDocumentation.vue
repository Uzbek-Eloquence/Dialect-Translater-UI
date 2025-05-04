<template>
  <div class="api-docs-wrapper">
    <div class="api-docs-container">
      <div class="api-docs-header">
        <div class="logo-container">
          <span class="title-label">Lahja</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b5ef4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="audio-icon">
            <path d="M2 10v3"/>
            <path d="M6 6v11"/>
            <path d="M10 3v18"/>
            <path d="M14 8v7"/>
            <path d="M18 5v13"/>
            <path d="M22 10v3"/>
          </svg>
        </div>
        <h1 class="api-title">API Dasturlash interfeysi</h1>
        <p class="api-subtitle">Dasturchilar uchun API orqali lug'at ma'lumotlariga kirish imkoniyati</p>
      </div>

      <div class="api-sidebar">
        <div class="sidebar-content">
          <h3>Tez o'tish</h3>
          <ul class="nav-links">
            <li><a href="#asosiy-malumotlar">Asosiy ma'lumotlar</a></li>
            <li><a href="#adabiy-sozlar">Adabiy so'zlar</a></li>
            <li><a href="#shevalar-va-tarjima">Shevalar va tarjima</a></li>
            <li><a href="#autentifikatsiya">Autentifikatsiya</a></li>
            <li><a href="#api-misollar">API bilan ishlash misollari</a></li>
          </ul>
        </div>
      </div>

      <div class="api-docs-content">
        <div id="asosiy-malumotlar" class="api-section">
          <h2 class="section-title">Asosiy ma'lumotlar</h2>
          <div class="api-card">
            <div class="api-card-header">
              <h3>API URL manzili</h3>
            </div>
            <div class="api-card-content">
              <div class="code-block">
                <code>http://localhost:5109</code>
              </div>
              <p>Barcha API so'rovlari uchun asosiy URL manzil.</p>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Autentifikatsiya</h3>
            </div>
            <div class="api-card-content">
              <p>API-dan foydalanish uchun JWT token talab qilinadi. Token olish uchun <code>/api/v1/Authorization/SignIn</code> yoki <code>/api/v1/Authorization/SignUp</code> endpointlaridan foydalaning.</p>
              <p>Har bir so'rovda tokenni HTTP sarlavhasida quyidagicha yuboring:</p>
              <div class="code-block">
                <code>Authorization: Bearer {your_token}</code>
              </div>
            </div>
          </div>
        </div>

        <div id="adabiy-sozlar" class="api-section">
          <h2 class="section-title">Adabiy so'zlar</h2>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Adabiy so'zlar ro'yxatini olish</h3>
              <span class="http-method post">POST</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/LiteraryWord</code></p>
              <p><strong>So'rov turi:</strong> JSON</p>
              <div class="subsection">
                <h4>So'rov parametrlari:</h4>
                <div class="code-block">
                  <pre>{
  "pageNumber": 0,    // Sahifa raqami
  "pageSize": 20,     // Sahifadagi so'zlar soni
  "title": "string",  // So'z nomini qidirish uchun (ixtiyoriy)
  "partOfSpeechId": 0, // So'z turkumi ID raqami (ixtiyoriy)
  "status": 0,         // So'z statusi (0 - kutilmoqda, 1 - tasdiqlangan)
  "description": "string" // So'z tavsifi bo'yicha qidirish (ixtiyoriy)
}</pre>
                </div>
              </div>
              <div class="subsection">
                <h4>Javob:</h4>
                <div class="code-block">
                  <pre>{
  "payload": {
    "totalCount": 1909,
    "pageNumber": 0,
    "pageSize": 20,
    "isFirst": true,
    "isLast": false,
    "data": [
      {
        "id": 37,
        "title": "Xato",
        "partOfSpeechId": 99,
        "description": "1. Noto'g'ri ish|2. Yanglishish, adashish",
        "status": 0
      },
      // ... boshqa so'zlar
    ]
  },
  "success": true,
  "error": null
}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>So'zni ID bo'yicha olish</h3>
              <span class="http-method get">GET</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/LiteraryWord/{id}</code></p>
              <div class="subsection">
                <h4>Javob:</h4>
                <div class="code-block">
                  <pre>{
  "payload": {
    "id": 3,
    "title": "abadiy",
    "partOfSpeechId": 2,
    "description": "Doimo mavjud bo'lgan, hech qachon tugamaydigan",
    "status": 0
  },
  "success": true,
  "error": null
}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Yangi adabiy so'z qo'shish yoki mavjudini yangilash</h3>
              <span class="http-method post">POST</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/LiteraryWord/upsert</code></p>
              <div class="subsection">
                <h4>So'rov parametrlari:</h4>
                <div class="code-block">
                  <pre>{
  "id": null,           // Yangi so'z uchun null, mavjud so'z uchun ID raqami
  "title": "string",    // So'z nomi (majburiy)
  "partOfSpeechId": 1,  // So'z turkumi ID raqami (majburiy)
  "description": "string" // So'z tavsifi (ixtiyoriy)
}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="shevalar-va-tarjima" class="api-section">
          <h2 class="section-title">Shevalar va tarjima</h2>

          <div class="api-card">
            <div class="api-card-header">
              <h3>So'zni tarjima qilish</h3>
              <span class="http-method post">POST</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/DialectalWord/translate</code></p>
              <div class="subsection">
                <h4>So'rov parametrlari:</h4>
                <div class="code-block">
                  <pre>{
  "from": 2,            // Boshlang'ich til (WordType enum)
  "to": 0,              // Maqsad til (WordType enum)
  "word": "string"      // Tarjima qilinadigan so'z
}</pre>
                </div>
                <p><strong>WordType enum:</strong></p>
                <ul class="enum-list">
                  <li><code>0</code> - PARKENT</li>
                  <li><code>1</code> - PISKENT</li>
                  <li><code>2</code> - LITERARY</li>
                  <li><code>3</code> - TOSHKENT</li>
                </ul>
              </div>
              <div class="subsection">
                <h4>Javob:</h4>
                <div class="code-block">
                  <pre>{
  "payload": {
    "translatedWord": "string",
    "partOfSpeech": "string"
  },
  "success": true,
  "error": null
}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Shevalar ro'yxati</h3>
              <span class="http-method get">GET</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/Dialect</code></p>
              <div class="subsection">
                <h4>Javob:</h4>
                <div class="code-block">
                  <pre>{
  "payload": [
    {
      "id": 1,
      "title": "Adabiy"
    },
    {
      "id": 2,
      "title": "Parkent"
    },
    // ... boshqa shevalar
  ],
  "success": true,
  "error": null
}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Sheva so'zlarini filtrlash</h3>
              <span class="http-method post">POST</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/DialectalWord/filter</code></p>
              <div class="subsection">
                <h4>So'rov parametrlari:</h4>
                <div class="code-block">
                  <pre>{
  "pageNumber": 0,         // Sahifa raqami
  "pageSize": 20,          // Sahifadagi so'zlar soni
  "title": "string",       // So'z nomini qidirish uchun (ixtiyoriy)
  "literaryWordId": null,  // Adabiy so'z ID raqami (ixtiyoriy)
  "dialectId": null        // Sheva ID raqami (ixtiyoriy)
}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="autentifikatsiya" class="api-section">
          <h2 class="section-title">Autentifikatsiya</h2>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Ro'yxatdan o'tish</h3>
              <span class="http-method post">POST</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/v1/Authorization/SignUp</code></p>
              <div class="subsection">
                <h4>So'rov parametrlari:</h4>
                <div class="code-block">
                  <pre>{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "password": "string"
}</pre>
                </div>
              </div>
              <div class="subsection">
                <h4>Javob:</h4>
                <div class="code-block">
                  <pre>{
  "payload": {
    "token": "string",
    "expireDate": "2025-05-04T12:00:00Z"
  },
  "success": true,
  "error": null
}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>Tizimga kirish</h3>
              <span class="http-method post">POST</span>
            </div>
            <div class="api-card-content">
              <p class="endpoint"><strong>Endpoint:</strong> <code>/api/v1/Authorization/SignIn</code></p>
              <div class="subsection">
                <h4>So'rov parametrlari:</h4>
                <div class="code-block">
                  <pre>{
  "phone": "string",
  "password": "string"
}</pre>
                </div>
              </div>
              <div class="subsection">
                <h4>Javob:</h4>
                <div class="code-block">
                  <pre>{
  "payload": {
    "token": "string",
    "expireDate": "2025-05-04T12:00:00Z"
  },
  "success": true,
  "error": null
}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="api-misollar" class="api-section">
          <h2 class="section-title">API bilan ishlash misollari</h2>

          <div class="api-card">
            <div class="api-card-header">
              <h3>JavaScript/Fetch misoli</h3>
            </div>
            <div class="api-card-content">
              <div class="code-block">
                <pre>// So'zni tarjima qilish misoli
async function translateWord(word, fromType, toType) {
  const response = await fetch('http://localhost:5109/api/DialectalWord/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({
      from: fromType,
      to: toType,
      word: word
    })
  });

  const data = await response.json();

  if (data.success) {
    return data.payload;
  } else {
    throw new Error(data.error ? data.error.message : 'Tarjima qilishda xatolik');
  }
}</pre>
              </div>
            </div>
          </div>

          <div class="api-card">
            <div class="api-card-header">
              <h3>C#/.NET misoli</h3>
            </div>
            <div class="api-card-content">
              <div class="code-block">
                <pre>// Adabiy so'zlar ro'yxatini olish
public async Task&lt;LiteraryWordResponse&gt; GetLiteraryWords(int page = 0, int pageSize = 20)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", _tokenService.GetToken());

    var request = new FilterLiteraryWordRequest
    {
        PageNumber = page,
        PageSize = pageSize
    };

    var content = new StringContent(
        JsonSerializer.Serialize(request),
        Encoding.UTF8,
        "application/json");

    var response = await client.PostAsync(
        "http://localhost:5109/api/LiteraryWord",
        content);

    response.EnsureSuccessStatusCode();

    var responseContent = await response.Content.ReadAsStringAsync();
    return JsonSerializer.Deserialize&lt;LiteraryWordResponse&gt;(responseContent);
}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiDocumentationPage'
}
</script>

<style scoped>
.api-docs-wrapper {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.api-docs-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.api-docs-header {
  grid-area: header;
  padding: 2rem 1.5rem;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  position: relative;
}

.logo-container {
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.title-label {
  font-size: 1.8rem;
  font-weight: 600;
  color: #5b5ef4;
  margin-right: 0.5rem;
}

.audio-icon {
  margin-top: 5px;
}

.api-title {
  font-size: 2rem;
  color: #5b5bf8;
  margin-bottom: 0.5rem;
}

.api-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.api-sidebar {
  grid-area: sidebar;
  background-color: #fff;
  border-right: 1px solid #eee;
  padding: 1.5rem;
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: calc(100vh - 160px);
}

.sidebar-content {
  position: sticky;
  top: 1.5rem;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.nav-links li {
  margin-bottom: 0.8rem;
}

.nav-links a {
  display: block;
  color: #5b5bf8;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover {
  background-color: rgba(91, 91, 248, 0.1);
}

.api-docs-content {
  grid-area: content;
  padding: 1.5rem 2rem 1.5rem 2rem;
  overflow-y: auto;
  height: calc(100vh - 160px);
}

.api-section {
  margin-bottom: 3rem;
  scroll-margin-top: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.75rem;
}

.api-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.api-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.api-card-header {
  background-color: #f8f9fa;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.api-card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.http-method {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.get {
  background-color: #5cb85c;
}

.post {
  background-color: #f0ad4e;
}

.put {
  background-color: #5bc0de;
}

.delete {
  background-color: #d9534f;
}

.api-card-content {
  padding: 1.5rem;
}

.endpoint {
  margin-bottom: 1rem;
  font-weight: 500;
}

.subsection {
  margin-top: 1.5rem;
}

.subsection h4 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #444;
}

.code-block {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem 0 1rem;
  overflow-x: auto;
}

.code-block code, .code-block pre {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #333;
  white-space: pre;
}

.enum-list {
  list-style-type: none;
  padding-left: 1rem;
  margin-bottom: 1rem;
}

.enum-list li {
  margin-bottom: 0.5rem;
}

@media (max-width: 900px) {
  .api-docs-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "content";
  }

  .api-sidebar {
    display: none;
  }

  .api-docs-content {
    padding: 1rem;
  }

  .logo-container {
    position: relative;
    top: 0;
    left: 0;
    justify-content: center;
    margin-bottom: 1rem;
  }
}

@media (max-width: 600px) {
  .api-docs-header {
    padding: 1.5rem 1rem;
  }

  .api-title {
    font-size: 1.6rem;
  }

  .api-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .api-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .http-method {
    margin-top: 0.5rem;
  }
}
</style>