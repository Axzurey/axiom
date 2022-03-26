-- Compiled with roblox-ts v1.2.3
local crypto = {}
do
	local _container = crypto
	local chars = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" }
	local numbers = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }
	local special = { "!", "@", "#", "$", "%", "^", "&", "*" }
	local utility = { "(", ")", "{", "}", "[", "]", "<", ">", "\\", "/", "|" }
	local punctuation = { "!", ";", ",", "/", "\\", "?", ".", '"', "\'", "" }
	local _ptr = {}
	local _length = #_ptr
	local _charsLength = #chars
	table.move(chars, 1, _charsLength, _length + 1, _ptr)
	_length += _charsLength
	local _numbersLength = #numbers
	table.move(numbers, 1, _numbersLength, _length + 1, _ptr)
	_length += _numbersLength
	table.move(special, 1, #special, _length + 1, _ptr)
	local tokenCharacters = _ptr
	local function token(tokenLength)
		local str = ""
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < tokenLength / 2) then
					break
				end
				local dice = math.random(0, #tokenCharacters)
				local index = tokenCharacters[dice + 1]
				str = str .. tostring(index)
			end
		end
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < tokenLength / 2) then
					break
				end
				local t = math.abs((math.sin(tick() * os.clock()) * #tokenCharacters)) - 1
				local index = tokenCharacters[t + 1]
				str = str .. tostring(index)
			end
		end
		return str
	end
	_container.token = token
end
return crypto
