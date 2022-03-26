-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local UserInputService = _services.UserInputService
local item
do
	item = {}
	function item:constructor()
		self.itemName = "unnamed item"
		self.equipped = false
		self.lastUsed = tick()
		self.cooldown = 1
		self.itemData = {}
	end
	function item:triggerEvent()
		if RunService:IsClient() then
			self.itemData.inputevent = UserInputService.InputBegan:Connect(function(input, gp)
				if gp then
					return nil
				end
				if not self.equipped then
					return nil
				end
				if input.UserInputType == Enum.UserInputType.MouseButton1 then
					if tick() - self.lastUsed < self.cooldown then
						return nil
					end
					self.lastUsed = tick()
					self:activate()
				end
			end)
		end
	end
	function item:equip()
		self.equipped = true
	end
	function item:unequip()
		self.equipped = false
	end
	function item:destroy()
		self:unequip()
		local _value = self.itemData.inputevent
		if _value ~= 0 and _value == _value and _value ~= "" and _value then
			(self.itemData.inputevent):Disconnect()
		end
	end
	function item:activate()
		print("Hello, this is the default activation method!")
	end
end
return {
	default = item,
}
