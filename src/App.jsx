import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import Home from "./pages/home/home";
import Perfil from "./pages/Perfil/Perfil";
import Config from "./pages/Configuracao/Config";
import Cadastro from "./pages/Cadastro/Cadastro";
import Info from "./pages/ConfiguracaoInfo/Info";
import Teste from "./pages/Teste/UserModalComponent";
import AlterSenha from "./pages/AlterSenha/AlterSenha";
import Loading from "./components/Loading/Loading";
import Ajuda from "./pages/Ajuda/Ajuda";
import TesteForm from "./pages/TestForm/TesteForm";
import PrivateRouter from "./components/PrivateRouter/PrivateRouter";
import PesquisaResults from "./pages/searchResults/PesquisaResults";
import PerfilUsuario from "./pages/PerfilUsuario/PerfilUsuario";
import Notification from "./pages/Notification/Notification";
import RedeSociais from "./pages/RedesSociais/RedesSociais"; 
import Hub from "./pages/Hub/Hub";
import UserModalComponent from './pages/UserListPage/UserModalComponent'
import RedefinirSenha from "./pages/RedefinirSenha/RedefinirSenha";
import ReedemCode from "./pages/ReedemCode/ReedemCode";


import Chats from "./pages/Chats/Chats";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
        </Routes>
        <Routes>
          <Route
            path="/perfil"
            element={
              <PrivateRouter>
                <Perfil />
              </PrivateRouter>
            }
          />
        </Routes>
        <Routes>
          <Route path="/config" element={<Config />} />
        </Routes>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
        <Routes>
          <Route path="/info" element={<Info />} />
        </Routes>
        <Routes>
          <Route path="/alterarSenha" element={<AlterSenha />} />
        </Routes>
        <Routes>
          <Route path="/ajuda" element={<Ajuda />} />
        </Routes>
        <Routes>
          <Route path="/testeForm" element={<TesteForm />} />
        </Routes>
        <Routes>
          <Route path="/teste" element={<Teste />} />
        </Routes>
        <Routes>
          <Route path="/loading" element={<Loading />} />
        </Routes>
        <Routes>
          <Route path="/notification" element={<Notification />} />
        </Routes>
        <Routes>
          <Route path="/redes_sociais" element={<RedeSociais />} />
        </Routes>
        <Routes>
          <Route path="/redefinirSenha" element={<RedefinirSenha />} />
        </Routes>
        <Routes>
          <Route path="/reedemCode" element={<ReedemCode />} />
        </Routes>
        <Routes>
          <Route
            path="/pesquisar/:user_firstName"
            element={
              <PrivateRouter>
                <PesquisaResults />
              </PrivateRouter>
            }
          />
          <Route
            path="/perfil/:user_name"
            element={
              <PrivateRouter>
                <PerfilUsuario />
              </PrivateRouter>
            }
          />

          <Route
            path="/hub"
            element={
              <PrivateRouter>
                <Hub />
              </PrivateRouter>
            }
          />

          <Route path="/chat" element={<UserModalComponent/>} />
          <Route path="/chat/:roomName" element={<Chats/>} />
          
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
