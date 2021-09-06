import { Layout, Affix, BackTop } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import HomeContent from "../../components/HomeContent/HomeContent";
import Footer from "../../components/Footer/Footer";

function Home() {
    return (
        <div>
            <Layout>
                <BackTop duration="800" />
                <Affix>
                    <Navbar />
                </Affix>
                <HomeContent
                    homeContentId="homeWeddingContent"
                    imgSrc={require("../../images/GN-821.jpg")}
                    btnText="Сватбена фотография"
                />
                <HomeContent
                    homeContentId="homePromContent"
                    imgSrc={require("../../images/bal.jpg")}
                    btnText="Абитуриентски балове"
                />
                <HomeContent
                    homeContentId="homeBaptismContent"
                    imgSrc={require("../../images/kryshtene.jpg")}
                    btnText="Кръщене"
                />
                <HomeContent
                    homeContentId="homeFamilyContent"
                    imgSrc={require("../../images/family3.jpg")}
                    btnText="Семейна фотосесия"
                />
                <Footer />
            </Layout>
        </div>
    );
}

export default Home;
