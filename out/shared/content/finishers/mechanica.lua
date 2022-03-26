-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local TweenService = _services.TweenService
local Workspace = _services.Workspace
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "paths").paths
local interpolations = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "functions", "interpolations")
local colorfool = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "packages", "colorfool")
local path = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "path").default
local function default(params)
	print("hello, it worked", params)
	local portal = path:pathToInstance(paths.mechanicaPortal):Clone()
	local sword = path:pathToInstance(paths.mechanicaSword):Clone()
	local character = params.character
	local targetCFrame = character:GetPrimaryPartCFrame()
	local _cFrame = CFrame.new(0, 0, -10)
	local backOffset = targetCFrame * _cFrame
	portal:SetPrimaryPartCFrame(backOffset)
	sword:SetPrimaryPartCFrame(backOffset)
	local defaultSizes = {}
	local _exp = portal:GetChildren()
	local _arg0 = function(v)
		if v:IsA("BasePart") then
			local _size = v.Size
			-- ▼ Map.set ▼
			defaultSizes[v] = _size
			-- ▲ Map.set ▲
			v.Size = Vector3.new()
		end
	end
	-- ▼ ReadonlyArray.forEach ▼
	for _k, _v in ipairs(_exp) do
		_arg0(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
	local _exp_1 = sword:GetChildren()
	local _arg0_1 = function(v)
		if v:IsA("BasePart") then
			local _size = v.Size
			-- ▼ Map.set ▼
			defaultSizes[v] = _size
			-- ▲ Map.set ▲
			v.Size = Vector3.new()
		end
	end
	-- ▼ ReadonlyArray.forEach ▼
	for _k, _v in ipairs(_exp_1) do
		_arg0_1(_v, _k - 1, _exp_1)
	end
	-- ▲ ReadonlyArray.forEach ▲
	portal.Parent = Workspace:FindFirstChild("ignore")
	sword.Parent = Workspace:FindFirstChild("ignore")
	local _arg0_2 = function(v, k)
		TweenService:Create(k, TweenInfo.new(.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
			Size = v,
		}):Play()
	end
	-- ▼ ReadonlyMap.forEach ▼
	for _k, _v in pairs(defaultSizes) do
		_arg0_2(_v, _k, defaultSizes)
	end
	-- ▲ ReadonlyMap.forEach ▲
	task.wait(.1)
	local t0 = 0
	local c1
	c1 = RunService.RenderStepped:Connect(function(dt)
		t0 = math.clamp(t0 + 5 * dt, 0, 1)
		local delta = interpolations.interpolateV3(t0, backOffset.Position, targetCFrame.Position, "quadIn")
		sword:SetPrimaryPartCFrame(CFrame.lookAt(delta, targetCFrame.Position))
		if t0 >= 1 then
			c1:Disconnect()
		end
	end)
	local pulse = colorfool.effectors.pulse.new(portal.centerGear)
	pulse.growVector = Vector3.new(1, -1, 1)
	pulse.parent = Workspace:FindFirstChild("ignore")
	pulse:render()
	task.wait(10)
	pulse:destroy()
end
return {
	default = default,
}
