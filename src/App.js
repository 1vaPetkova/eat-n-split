import { useState } from "react";
import { initialFriends } from "./Data.js";

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddForm, setShowAddForm] = useState(false);

  function onChangeAddFormVisibility() {
    setShowAddForm((s) => !s);
  }

  function handleAddFriend(newFriend) {
    setFriends((f) => [...f, newFriend]);
    setShowAddForm(false);
  }

  function handleDeleteFriend(idToRemove) {
    setFriends((f) => f.filter((f) => f.id !== idToRemove));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onDelete={handleDeleteFriend} />
        {showAddForm && <FormAddFriend onAddNewFriend={handleAddFriend} />}
        <Button className="button" onClick={onChangeAddFormVisibility}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

function FriendsList({ friends, onDelete }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend key={f.id} friend={f} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function Friend({ friend, onDelete }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance <= 0 ? (
        friend.balance < 0 ? (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}€
          </p>
        ) : (
          <p>You and {friend.name} are even</p>
        )
      ) : (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      <Button>Select</Button>
      <Button onClick={() => onDelete(friend.id)}>Delete</Button>
    </li>
  );
}

function FormAddFriend({ onAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    //prevent refresh page
    e.preventDefault();

    if (!name || !image) return;

    const newId = crypto.randomUUID();

    const newFriend = {
      id: newId,
      name,
      image,
      balance: 0,
    };

    onAddNewFriend(newFriend);
    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Name</label>
      <input
        type="text"
        placeholder="Friend's name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>👱 Image URL</label>
      <input
        type="text"
        placeholder="Type image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with: X</h2>
      <label>💰 Bill value:</label>
      <input type="text" placeholder="0.00" />
      <label>🧑‍🦰 Your expense</label>
      <input type="text" placeholder="0.00" />
      <label>🤷 "name" expense</label>
      <input disabled type="text" placeholder="0.00" />
      <label>🤑 Who is paying the bill</label>
      <select>
        <option value="user">Me</option>
        <option value="friend">Friend</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
