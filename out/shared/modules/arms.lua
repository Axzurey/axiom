-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local left_rest = CFrame.new(-1, -.5, .5)
local right_rest = CFrame.new(0, -.5, .5)
local arms
do
	arms = setmetatable({}, {
		__tostring = function()
			return "arms"
		end,
	})
	arms.__index = arms
	function arms.new(...)
		local self = setmetatable({}, arms)
		return self:constructor(...) or self
	end
	function arms:constructor()
		local arms = ReplicatedStorage:FindFirstChild("viewmodel:blank")
		self.viewmodel = arms
	end
	function arms:smoothArmLookAt(camera, viewmodel, arm, position)
		local selected = arm == "right" and viewmodel.rightMotor or viewmodel.leftMotor
		--[[
			let t = TweenService.Create(selected, new TweenInfo(.2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
			CFrame: CFrame.lookAt(selected.Position, position).mul(CFrame.Angles(0, math.pi / 2, 0))
			});
			t.Play();
		]]
		local t = 0
		local oTra = selected.Transform
		local c
		c = RunService.Stepped:Connect(function(_, dt)
			t += 2 * dt
			if t > 1 then
				c:Disconnect()
				return nil
			end
			local f = left_rest
			f = viewmodel.rootpart.CFrame:ToWorldSpace(f)
			local target = CFrame.lookAt(f.Position, position)
			local final = viewmodel.rootpart.CFrame:ToObjectSpace(target)
			local camLook = viewmodel.rootpart.CFrame:VectorToObjectSpace(camera.CFrame.LookVector)
			local pointLook = final.LookVector
			local dot = -camLook:Dot(pointLook)
			local _final = final
			local _lookVector = camera.CFrame.LookVector
			local _arg0 = -viewmodel.leftArm.Size.Z * (dot + 1)
			local _cFrame = CFrame.new(_lookVector * _arg0)
			local goal = _final * _cFrame
			selected.Transform = selected.Transform:Lerp(goal, math.clamp(t * 2, 0, 1))
		end)
	end
end
return {
	default = arms,
}
