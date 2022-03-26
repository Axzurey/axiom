-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Debris = _services.Debris
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local TweenService = _services.TweenService
local Workspace = _services.Workspace
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local bulletHoleMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "bulletHoleMap")
local matchService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "matchservice")
local minerva = {}
do
	local _container = minerva
	local function extractKeysFromDictionaries(dictionaries)
		local keys = {}
		local _arg0 = function(d)
			for i, v in pairs(d) do
				-- ▼ Array.push ▼
				keys[#keys + 1] = i
				-- ▲ Array.push ▲
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(dictionaries) do
			_arg0(_v, _k - 1, dictionaries)
		end
		-- ▲ ReadonlyArray.forEach ▲
		return keys
	end
	_container.extractKeysFromDictionaries = extractKeysFromDictionaries
	local allowedOverheal = 50
	_container.allowedOverheal = allowedOverheal
	local reloadLengths = {
		mpx = 1.28,
		glock18 = 1.4,
	}
	_container.reloadLengths = reloadLengths
	local bombPlantTime = 5
	_container.bombPlantTime = bombPlantTime
	local bombDefuseTime = 5
	_container.bombDefuseTime = bombDefuseTime
	local defuseRange = 8
	_container.defuseRange = defuseRange
	local timeTillDroppedBombCanBePickedUp = .5
	_container.timeTillDroppedBombCanBePickedUp = timeTillDroppedBombCanBePickedUp
	local bombName = "@entity.bomb"
	_container.bombName = bombName
	local serverName = "Minerva System"
	_container.serverName = serverName
	_container.isBombPlanted = false
	if RunService:IsClient() then
		matchService.playerFinishesPlantingBomb:connect(function(playername, timeplanted)
			_container.isBombPlanted = true
		end)
	end
	local function createSoundAt(position, parent, volume, id)
		local p = Instance.new("Attachment")
		local s = Instance.new("Sound")
		s.Volume = volume
		s.SoundId = id
		s.Parent = p
		p.Parent = parent
		p.WorldPosition = position
		s:Play()
		Debris:AddItem(p, 3)
	end
	_container.createSoundAt = createSoundAt
	local function createBulletHole(position, normal, material, bulletSize, imageColor)
		if bulletSize == nil then
			bulletSize = 12
		end
		if imageColor == nil then
			imageColor = Color3.new(1, 1, 1)
		end
		local p = Instance.new("Part")
		p.CanCollide = false
		p.Anchored = true
		p.CanQuery = false
		p.CanTouch = false
		p.Size = Vector3.new(1, 1, 0)
		p.Transparency = 1
		p.CFrame = CFrame.lookAt(position, position + normal)
		local scrgui = Instance.new("SurfaceGui")
		scrgui.PixelsPerStud = 50
		scrgui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud
		scrgui.Parent = p
		local img = Instance.new("ImageLabel")
		local _condition = bulletHoleMap[material.Name]
		if not (_condition ~= "" and _condition) then
			_condition = bulletHoleMap.other
		end
		local pull = _condition
		img.Image = pull
		img.ImageColor3 = imageColor
		img.Size = UDim2.fromOffset(bulletSize, bulletSize)
		img.AnchorPoint = Vector2.new(.5, .5)
		img.Position = UDim2.fromScale(.5, .5)
		img.BackgroundTransparency = 1
		img.Parent = scrgui
		p.Parent = Workspace:FindFirstChild("ignore")
		local start = tick()
		local c
		c = RunService.Stepped:Connect(function(_t, dt)
			if img.ImageTransparency >= 1 then
				c:Disconnect()
				p:Destroy()
				return nil
			end
			if tick() - start > 10 then
				img.ImageTransparency += 2 * dt
			end
		end)
	end
	_container.createBulletHole = createBulletHole
	local function bombActivationSequence(bomb)
		local _result = bomb:FindFirstChild("AnimationController")
		if _result ~= nil then
			_result = _result:FindFirstChild("Animator")
		end
		local animator = _result
		local am = Instance.new("Animation")
		am.AnimationId = animationsMap.bomb_activation_sequence
		am.Parent = ReplicatedStorage
		local animation = animator:LoadAnimation(am)
		am:Destroy()
		animation:Play()
		local objs = {
			t1 = bomb:FindFirstChild("tubing1"),
			t2 = bomb:FindFirstChild("tubing2"),
			t3 = bomb:FindFirstChild("tubing3"),
			ball = bomb:FindFirstChild("ball"),
			ring = bomb:FindFirstChild("ring"),
		}
		animation.Stopped:Connect(function()
			for i, v in pairs(objs) do
				v.Transparency = 0
			end
		end)
		coroutine.wrap(function()
			animation.Stopped:Wait()
			local _exp = bomb:GetChildren()
			local _arg0 = function(v)
				if not v:IsA("BasePart") then
					return nil
				end
				v.Anchored = true
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_exp) do
				_arg0(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local delta = 1
			local bg = 0
			local t = 0
			local c
			c = RunService.Heartbeat:Connect(function(dt)
				delta += 1 * dt
				t += 1 * dt
				local _cFrame = objs.ball.CFrame
				local _arg0_1 = CFrame.Angles(math.rad(5 * delta * dt), 0, 0)
				objs.ball.CFrame = _cFrame * _arg0_1
				local _cFrame_1 = objs.ring.CFrame
				local _arg0_2 = CFrame.Angles(0, math.rad(5 * delta * 2 * dt), 0)
				objs.ring.CFrame = _cFrame_1 * _arg0_2
				bg = math.clamp(bg + (matchService.stateLengths.planted / 12) * dt, 0, 255)
				objs.ball.Color = Color3.fromRGB(255, bg, bg)
				objs.ring.Color = Color3.fromRGB(150, bg, bg)
				if t >= matchService.stateLengths.planted then
					local t1 = TweenInfo.new(.25, Enum.EasingStyle.Exponential)
					local t2 = TweenInfo.new(1, Enum.EasingStyle.Exponential)
					TweenService:Create(objs.ring, t1, {
						Size = Vector3.new(0, 0, 0),
					}):Play()
					task.wait(.25)
					TweenService:Create(objs.ball, t2, {
						Size = Vector3.new(300, 300, 300),
					}):Play()
					task.wait(3)
					TweenService:Create(objs.ball, t2, {
						Size = Vector3.new(0, 0, 0),
					}):Play()
					task.wait(1)
					c:Disconnect()
				end
			end)
		end)()
	end
	_container.bombActivationSequence = bombActivationSequence
end
return minerva
