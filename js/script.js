// variáveis
const url = "https://jsonplaceholder.typicode.com/posts";
const loadingPosts = document.querySelector("#loadingPots");
const postsContainer = document.querySelector("#postsContainer");

const postPage = document.querySelector("body");
const postContainer = document.querySelector("#postBody");
const showCommentsContainer = document.querySelector("#showCommentsContainer");
const loadingPost = document.querySelector("#loadingPost");

const commnetForm = document.querySelector("#commentContainer");
const userEmail = document.querySelector("#email");
const userComment =  document.querySelector("#body");

//pegar ID da URL(get ID from URL)
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

//pegar todas os posts (get all posts)
async function getAllPosts() {
  
  //resposta da function
  const resposnse = await fetch(url);

  //passando a resp para formatação JSON
  const data = await resposnse.json()

  console.log(data);

  //removendo o "carregando..."
  loadingPosts.style.display = "none";

  data.map((post) =>{  // mapeando o objeto JSON retornado 
    /*
    //criando os molde dos posts
    const div = document.createElement("div"); //container do post
    const title = document.createElement("h2"); //título do post 
    const body = document.createElement("p"); //conteúdo do post em texto
    const link = document.createElement("a"); //link de direcionameto "ler mais..."

    //preenchendo o molde
    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "ler mais...";
    link.setAttribute("href", `/post.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
    */
    const div1 = document.createElement("div");

    div1.innerHTML = `<div>
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <p>${post.id}</p>
    <a id="btnReadMore" href="/html/pagePost.html?id=${post.id}">ler mais...</a>
    </div>`

    postsContainer.appendChild(div1);
  })
}

//pegar cada post individualmente(get individual post)
async function getPost(id) {
  const [resposnsePost, resposnseComments] = await Promise.all([
    fetch(`${url}/${id}`), //pegando o post(get post)
    fetch(`${url}/${id}/comments`) //pegando os comentários(get all comments)
  ]);

  //passando os dados para JSON
  const dataPost = await resposnsePost.json();
  const dataComments = await resposnseComments.json();

  //removendo o "carregando..."
  loadingPost.style.display = "none";

  const bodyPost = document.createElement("div");

  bodyPost.innerHTML = `<div>
  <h1>${dataPost.title}</h1>
  <p>${dataPost.body}</p>
  </div>`

  postContainer.appendChild(bodyPost);

  console.log(dataComments)

  dataComments.map((comment) => { // mapeamneto para criação do comentário do usuário
    createComment(comment); // chamando a function resposnsável pela criação do comentário do usuário
  });
}

//criando o comentário do usuário
function createComment(comment) {
  const divCommnent = document.createElement("div");

  divCommnent.innerHTML = `<div>
  <h3>${comment.email}</h3>
  <p>${comment.body}</p>
  </div>`;

  showCommentsContainer.appendChild(divCommnent);
}

//postar comentário do usuário(post a comment)
async function postComment(comment) {
  const resposnse = await fetch(`${url}/${postId}/comments`, { // lendo o link passado 
    method: "POST", // método de criação
    body: comment,
    headers: {
      "content-type": "application/json"
    },
  });
  
  const data = await resposnse.json();
  // function para add comentário aos outros
  createComment(data); // chamando a function
}

if(!postId) {
  getAllPosts();
}else {
  getPost(postId);

  commnetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let comment = {
      email: userEmail.value,
      body: userComment.value
    };
    //passando o comentário do usuário para JSON para enviar para a API
    commentJSON = JSON.stringify(comment);

    postComment(commentJSON);

  });
};
