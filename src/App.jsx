import { useState, useEffect } from "react";
import { HashConnect } from "hashconnect";
import { LedgerId } from "@hashgraph/sdk";
import {
  Twitter,
  MessageCircle,
  Instagram,
  Github,
  Wallet,
  Menu,
  CandyCane,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import "./App.css";
import { CoinTradingFloorPriceChart, CoinSimpleVolumeChart } from "poli-charts";

export default function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hashConnect, setHashConnect] = useState(null);
  const [paringData, setPairingData] = useState(null);
  const [isHolder, setIsHolder] = useState(null);
  const [loading, setLoading] = useState(false);

  const $ = (selector) => document.querySelector(selector);

  useEffect(() => {
    const searhData = async () => {
      await fetchUserData();
    };
    if (isWalletConnected) {
      searhData();
    }
    if (isHolder) {
      CoinTradingFloorPriceChart({
        elementId: "container_testing",
        backgroundColor: "#2f2828",
        chartColor: "#FF5733",
        fetchData: {
          tokenId: "0.0.4571363",
        },
        fontConfig: {
          size: "12px",
          color: "#fff",
        },
      });

      CoinSimpleVolumeChart({
        elementId: "container_testing_2",
        backgroundColor: "#2f2828",
        chartColor: "#FF5733",
        fetchData: {
          tokenId: "0.0.4571363",
        },
        fontConfig: {
          size: "12px",
          color: "#fff",
        },
      });
    }
  }, [isWalletConnected]);

  const fetchUserData = async () => {
    setLoading(true);
    const tokenId = "0.0.4571363";
    const accountId = paringData.accountIds && paringData.accountIds[0];

    if (!accountId) {
      console.error("ID de cuenta no especificado");
      return false;
    }

    try {
      const response = await fetch(
        `https://mainnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/tokens`
      );

      if (!response.ok) {
        console.error(
          "Error en la solicitud:",
          response.status,
          response.statusText
        );
        setLoading(false);
        return false;
      }
      const data = await response.json();

      const hasToken = data.tokens.some(
        (token) => token.token_id === tokenId && token.balance > 0
      );

      setIsHolder(hasToken);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      setLoading(false);
      return false;
    }
  };

  const initializeHashConnect = async () => {
    setLoading(true);
    const hashConnect = new HashConnect(
      LedgerId.MAINNET,
      "52e6b5481300b4ce8e9bf9bd240d61f4",
      {
        name: "Kabila x Polaris",
        description: "Mira las ultimas estadisticas de tus NFT",
        icons: ["<Image url>"],
        url: "https://kabila.polarisweb3.org",
      },
      true
    );
    setHashConnect(hashConnect);

    //register events
    hashConnect.pairingEvent.on((newPairing) => {
      setPairingData(newPairing);
      setIsWalletConnected(true);
    });

    hashConnect.disconnectionEvent.on((data) => {
      setPairingData(null);
      setIsWalletConnected(false);
    });

    await hashConnect.init();
    setLoading(false);
  };

  const connectWallet = async () => {
    if (!hashConnect) {
      await initializeHashConnect(); // Espera a la inicialización
    }
    hashConnect.openPairingModal();
  };

  const disconnectWallet = () => {
    hashConnect.disconnect();
  };

  return (
    <div className={`app`}>
      <div className="app-container">
        <header className="header">
          <nav className="nav">
            <h1 className="logo">
              Candy <b style={{ color: "#84e1bc" }}>x</b>{" "}
              <span style={{ color: "white" }}>Polaris</span>
            </h1>
            <div className="menu-button">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="menu-icon" />
              </Button>
            </div>
            <div className="nav-items">
              <Button variant="ghost" size="icon" className="social-button">
                <Twitter className="social-icon" />
              </Button>
              <Button variant="ghost" size="icon" className="social-button">
                <MessageCircle className="social-icon" />
              </Button>
              <Button variant="ghost" size="icon" className="social-button">
                <Instagram className="social-icon" />
              </Button>
              <Button variant="ghost" size="icon" className="social-button">
                <Github className="social-icon" />
              </Button>
              <Button
                className="wallet-button"
                onClick={isWalletConnected ? disconnectWallet : connectWallet}
              >
                <Wallet className="wallet-icon" />
                {isWalletConnected
                  ? `${paringData.accountIds[0]}`
                  : "Connect Wallet"}
              </Button>
            </div>
          </nav>
          {isMenuOpen && (
            <div className="mobile-menu">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-evenly",
                }}
              >
                <Button variant="ghost" size="icon" className="social-button">
                  <Twitter className="social-icon" />
                </Button>
                <Button variant="ghost" size="icon" className="social-button">
                  <MessageCircle className="social-icon" />
                </Button>
                <Button variant="ghost" size="icon" className="social-button">
                  <Instagram className="social-icon" />
                </Button>
                <Button variant="ghost" size="icon" className="social-button">
                  <Github className="social-icon" />
                </Button>
              </div>
              <Button
                className="wallet-button mobile-wallet-button"
                onClick={isWalletConnected ? disconnectWallet : connectWallet}
              >
                <Wallet className="wallet-icon" />
                {isWalletConnected
                  ? `${paringData.accountIds[0]}`
                  : "Connect Wallet"}
              </Button>
            </div>
          )}
        </header>

        <main className="main-content">
          <section className="nft-collections">
            <div className="collections-container">
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    width: "calc(100% - 2rem)",
                    height: "100%",
                    zIndex: "9999",
                    backgroundColor: "#2f2828",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{
                      width: "300px",
                      height: "250px",
                    }}
                    src="https://cusoft.tech/wp-content/uploads/2024/05/loading.gif"
                  />
                </div>
              )}
              {isHolder && isWalletConnected ? (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    id="container_testing"
                    style={{
                      width: "60vw",
                      height: "300px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "34vw",
                      height: "300px",
                    }}
                    id="container_testing_2"
                  ></div>

                  <div style={{ position: "relative" }}>
                    <img src="https://cusoft.tech/wp-content/uploads/2024/11/image-removebg-preview-29.png" />
                    <img
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        zIndex: -1,
                      }}
                      src="https://cusoft.tech/wp-content/uploads/2024/11/1109.mp4"
                    />
                  </div>
                </div>
              ) : isHolder === false && isWalletConnected ? (
                <div
                  className="empty-collections"
                  style={{
                    display: "flex",

                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img src="https://cusoft.tech/wp-content/uploads/2024/11/image-removebg-preview-29.png" />
                  <p>You are not Candy's holder :(</p>
                  <Button
                    onClick={() =>
                      window.open("https://www.candyhbar.com", "_blank")
                    }
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#ea6868",
                      color: "white",
                    }}
                  >
                    <CandyCane className="wallet-icon" />
                    <span
                      style={{
                        marginLeft: "-0.5rem",
                      }}
                    >
                      GO to Candy Machine
                    </span>
                  </Button>
                </div>
              ) : (
                <div
                  className="empty-collections"
                  style={{
                    display: "flex",

                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img src="https://cusoft.tech/wp-content/uploads/2024/11/image-removebg-preview-29.png" />
                  <p>Wallet not connected</p>
                  <Button
                    onClick={
                      isWalletConnected ? disconnectWallet : connectWallet
                    }
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#ea6868",
                      color: "white",
                    }}
                  >
                    <Wallet className="wallet-icon" />
                    <span
                      style={{
                        marginLeft: "-0.5rem",
                      }}
                    >
                      Connect Wallet
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="footer">
          <p className="footer-text">
            Built by{" "}
            <span className="footer-highlight">Qsoft Development Team</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
