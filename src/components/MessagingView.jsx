import { useState } from "react";
import {
  IconSend,
  IconCheck,
  IconUser,
  IconBuilding,
  IconSearch,
  IconShield,
  IconSparkles,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

export default function MessagingView({ onToast }) {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([
    {
      id: "conv-1",
      participantName: "Priya Senthil Kumar",
      participantRole: "Principal Technical Recruiter",
      participantCompany: "Freshworks Inc (Chennai)",
      participantAvatar: "PS",
      lastMessage: "Hi Arunachalam, we reviewed your FastAPI & React Agritech project and would love to schedule a screening call this Friday.",
      lastTime: "11:20 AM",
      unread: 1,
      isConnectionAccepted: true,
      messages: [
        {
          id: "m-1",
          sender: "them",
          text: "Vanakkam Arunachalam! Thanks for applying to the Senior Full Stack role at our Chennai OMR center.",
          time: "10:45 AM",
        },
        {
          id: "m-2",
          sender: "me",
          text: "Vanakkam Priya! Glad to connect. I have been following Freshworks' SaaS engineering blogs closely.",
          time: "11:02 AM",
        },
        {
          id: "m-3",
          sender: "them",
          text: "We reviewed your FastAPI & React Agritech project and would love to schedule a screening call this Friday.",
          time: "11:20 AM",
        },
      ],
    },
    {
      id: "conv-2",
      participantName: "Karthik Natarajan",
      participantRole: "Principal Embedded Lead",
      participantCompany: "Hyundai Motor India (Sriperumbudur)",
      participantAvatar: "KN",
      lastMessage: "The CAN protocol design test link has been dispatched to your email.",
      lastTime: "Yesterday",
      unread: 0,
      isConnectionAccepted: true,
      messages: [
        {
          id: "m-201",
          sender: "them",
          text: "Hello! We are actively looking for engineers with microcontroller & CAN bus experience.",
          time: "Yesterday, 3:10 PM",
        },
        {
          id: "m-202",
          sender: "them",
          text: "The CAN protocol design test link has been dispatched to your email.",
          time: "Yesterday, 4:25 PM",
        },
      ],
    },
    {
      id: "conv-3",
      participantName: "Senthil Nathan",
      participantRole: "HR Manager",
      participantCompany: "KPR Mill Limited (Coimbatore)",
      participantAvatar: "SN",
      lastMessage: "Connection request accepted. You can now chat directly.",
      lastTime: "Oct 22",
      unread: 0,
      isConnectionAccepted: true,
      messages: [
        {
          id: "m-301",
          sender: "them",
          text: "Connection request accepted. You can now chat directly.",
          time: "Oct 22",
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState("conv-1");
  const [msgInput, setMsgInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const activeConv =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  function handleSendMessage(e) {
    e.preventDefault();
    if (!msgInput.trim() || !activeConv) return;

    const newMsg = {
      id: "m-" + Date.now(),
      sender: "me",
      text: msgInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: newMsg.text,
            lastTime: newMsg.time,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setMsgInput("");

    // Simulate smart recruiter acknowledgment
    setTimeout(() => {
      const replyMsg = {
        id: "m-reply-" + Date.now(),
        sender: "them",
        text: `Got your message! I will coordinate with the team at ${activeConv.participantCompany} and get back to you shortly.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConv.id) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              lastTime: replyMsg.time,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
      if (onToast) onToast(`New message from ${activeConv.participantName}`);
    }, 1400);
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.participantCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messaging-view-container">
      {/* Left Column: Conversation List */}
      <div className="conversations-sidebar">
        <div className="conversations-header">
          <h3>Professional Messages</h3>
          <span className="privacy-badge">
            <IconShield size={12} /> Verified & Private
          </span>
        </div>

        <div className="conversations-search">
          <IconSearch size={16} />
          <input
            type="text"
            placeholder="Search contacts, recruiters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                className={`conversation-item ${isActive ? "conversation-item--active" : ""}`}
                onClick={() => {
                  setActiveConvId(conv.id);
                  // Mark as read
                  setConversations((prev) =>
                    prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                  );
                }}
              >
                <div className="conv-avatar">{conv.participantAvatar}</div>
                <div className="conv-content">
                  <div className="conv-top-row">
                    <span className="conv-name">{conv.participantName}</span>
                    <span className="conv-time">{conv.lastTime}</span>
                  </div>
                  <span className="conv-sub">{conv.participantCompany}</span>
                  <p className="conv-snippet">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="conv-unread-dot">{conv.unread}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat Stream */}
      {activeConv ? (
        <div className="chat-thread-pane">
          {/* Active Contact Header */}
          <div className="chat-thread-header">
            <div className="chat-contact-info">
              <div className="conv-avatar conv-avatar--lg">
                {activeConv.participantAvatar}
              </div>
              <div>
                <h4>{activeConv.participantName}</h4>
                <p className="contact-company-text">
                  {activeConv.participantRole} • <strong>{activeConv.participantCompany}</strong>
                </p>
              </div>
            </div>

            <div className="connection-status-pill">
              <IconSparkles size={14} /> Connection Active
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-messages-scroll">
            <div className="chat-encryption-notice">
              🔒 End-to-end authorized messaging between verified job seeker and employer.
            </div>

            {activeConv.messages.map((m) => {
              const isMe = m.sender === "me";
              return (
                <div
                  key={m.id}
                  className={`chat-bubble-row ${isMe ? "chat-bubble-row--me" : "chat-bubble-row--them"}`}
                >
                  <div className="chat-bubble">
                    <p className="chat-bubble-text">{m.text}</p>
                    <div className="chat-bubble-time">
                      <span>{m.time}</span>
                      {isMe && <span className="read-receipt">✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="chat-composer-bar">
            <input
              type="text"
              placeholder={`Message ${activeConv.participantName.split(" ")[0]}...`}
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!msgInput.trim()}
            >
              <IconSend size={16} /> Send
            </button>
          </form>
        </div>
      ) : (
        <div className="chat-empty-state">
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
