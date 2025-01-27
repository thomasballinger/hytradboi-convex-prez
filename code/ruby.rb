def transfer_money(from_id, to_id, amount)
  ActiveRecord::Base.connection.transaction(isolation: :serializable) do
    balance = ActiveRecord::Base.connection.select_one(
      "SELECT balance FROM accounts WHERE id = $1", [from_id]
    )["balance"]
    
    raise InsufficientFundsError if balance < amount

    ActiveRecord::Base.connection.execute(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, from_id]
    )
    ActiveRecord::Base.connection.execute(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, to_id]
    )
    ActiveRecord::Base.connection.execute(
      "INSERT INTO transfers (from_account_id, to_account_id, amount, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW())",
      [from_id, to_id, amount]
    )
  end
rescue ActiveRecord::SerializationFailure => e
  raise TransferError, "Transfer failed due to concurrent modification"
end
