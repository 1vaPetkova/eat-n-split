import { useState } from "react";
import { initialFriends } from "./Data.js";

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

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

  function handleSelection(friend) {
    setSelectedFriend((f) => (f?.id === friend.id ? null : friend));
  }

  function handleSplitBill(diff) {
    setFriends((friends) =>
      friends.map((f) =>
        f.id === selectedFriend.id ? { ...f, balance: f.balance + diff } : f
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onDelete={handleDeleteFriend}
          onSelect={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddForm && <FormAddFriend onAddNewFriend={handleAddFriend} />}
        <Button className="button" onClick={onChangeAddFormVisibility}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selected={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onDelete, onSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          key={f.id}
          friend={f}
          onDelete={onDelete}
          onSelect={onSelect}
          isSelected={selectedFriend?.id === f.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onDelete, onSelect, isSelected }) {
  return (
    <li className={isSelected ? "selected" : ""}>
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
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
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

function FormSplitBill({ selected, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [userExpense, setUserExpense] = useState(0);
  const [payer, setPayer] = useState("user");

  const theirExpense = parseFloat((bill - userExpense).toFixed(2));

  function calculateBalance(e) {
    //prevent refresh page
    e.preventDefault();
    if (!bill || !userExpense) return;

    onSplitBill(payer === "user" ? theirExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={calculateBalance}>
      <h2>Split a bill with: {selected.name}</h2>
      <label>💰 Bill value:</label>
      <input
        type="number"
        min="0.0"
        placeholder="0.00"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧑‍🦰 Your expense</label>
      <input
        type="number"
        max={bill}
        placeholder="0.00"
        value={userExpense}
        onChange={(e) => setUserExpense(Number(e.target.value))}
      />
      <label>🤷 {selected.name}'s expense</label>
      <input disabled type="number" placeholder="0.00" value={theirExpense} />
      <label>🤑 Who is paying the bill</label>
      <select onChange={(e) => setPayer(e.target.value)} value={payer}>
        <option value="user">You</option>
        <option value="friend">{selected.name}</option>
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
