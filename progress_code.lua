-- MissingPartType: "Trans", "Color", "TransAndColor".
-- Direction: "Left", "Middle", Right".
-- StarterPoint: "Up", "Down", "Left", "Right"

local F1 = script.Parent.Parent.Frame1
local F2 = script.Parent.Parent.Frame2




function FramePosChanger(Direction,StarterPoint)
	if Direction == "Vertical" then
		F1.Position = StarterPoint == "Up" and UDim2.fromScale(0,0) or UDim2.fromScale(1,0)
		F2.Position = StarterPoint == "Up" and UDim2.fromScale(1,0) or UDim2.fromScale(0,0)
		F1.AnchorPoint = StarterPoint == "Up" and Vector2.new(0,0) or Vector2.new(1,0)
		F2.AnchorPoint = StarterPoint == "Up" and Vector2.new(1,0) or Vector2.new(0,0)
		F1.Size = UDim2.fromScale(0.5,1)
		F2.Size = UDim2.fromScale(0.5,1)
		F1.ImageLabel.Position = StarterPoint == "Up" and UDim2.fromScale(0,0) or UDim2.fromScale(1,0)
		F2.ImageLabel.Position = StarterPoint == "Up" and UDim2.fromScale(1,0) or UDim2.fromScale(0,0)
		F1.ImageLabel.AnchorPoint = StarterPoint == "Up" and Vector2.new(0,0) or Vector2.new(1,0)
		F2.ImageLabel.AnchorPoint = StarterPoint == "Up" and Vector2.new(1,0) or Vector2.new(0,0)
		F1.ImageLabel.Size = UDim2.fromScale(2,1)
		F2.ImageLabel.Size = UDim2.fromScale(2,1)
	elseif Direction == "Horizontal" then
		F1.Position = StarterPoint == "Right" and UDim2.fromScale(0,0) or UDim2.fromScale(0,1)
		F2.Position = StarterPoint == "Right" and UDim2.fromScale(0,1) or UDim2.fromScale(0,0)
		F1.AnchorPoint = StarterPoint == "Right" and Vector2.new(0,0) or Vector2.new(0,1)
		F2.AnchorPoint = StarterPoint == "Right" and Vector2.new(0,1) or Vector2.new(0,0)
		F1.Size = UDim2.fromScale(1,0.5)
		F2.Size = UDim2.fromScale(1,0.5)
		F1.ImageLabel.Position = StarterPoint == "Right" and UDim2.fromScale(0,0) or UDim2.fromScale(0,1)
		F2.ImageLabel.Position = StarterPoint == "Right" and UDim2.fromScale(0,1) or UDim2.fromScale(0,0)
		F1.ImageLabel.AnchorPoint = StarterPoint == "Right" and Vector2.new(0,0) or Vector2.new(0,1)
		F2.ImageLabel.AnchorPoint = StarterPoint == "Right" and Vector2.new(0,1) or Vector2.new(0,0)
		F1.ImageLabel.Size = UDim2.fromScale(1,2)
		F2.ImageLabel.Size = UDim2.fromScale(1,2)
	end
end

function Progress(Value)
	local EvenX = math.floor(script.Parent.Parent.AbsoluteSize.X + 0.5)%2
	local EvenY = math.floor(script.Parent.Parent.AbsoluteSize.Y + 0.5)%2
	local PercentNumber = math.clamp(Value * 3.6,0,360)
	local I1 = script.Parent.Parent.Frame1.ImageLabel
	local I2 = script.Parent.Parent.Frame2.ImageLabel
	local G1 = I1.UIGradient
	local G2 = I2.UIGradient
	I1.ImageColor3 = script.ImageColor.Value
	I2.ImageColor3 = script.ImageColor.Value
	I1.ImageTransparency = script.ImageTrans.Value
	I2.ImageTransparency = script.ImageTrans.Value
	I1.Image = "rbxassetid://" .. script.ImageId.Value
	I2.Image = "rbxassetid://" .. script.ImageId.Value
	if script.StarterPoint.Value == "Up" or script.StarterPoint.Value == "Down"  then
		FramePosChanger("Vertical",script.StarterPoint.Value)
		if script.StarterPoint.Value == "Up" then
			if script.Direction.Value == "Left" then
				G1.Rotation = math.clamp(PercentNumber,180,360)
				G2.Rotation = math.clamp(PercentNumber,0,180)
			elseif script.Direction.Value == "Right" then
				G1.Rotation = 180 - math.clamp(PercentNumber,0,180)
				G2.Rotation = - math.clamp(PercentNumber,180,360) + 180
			elseif script.Direction.Value == "Middle" then
				G1.Rotation = 180 - math.clamp(PercentNumber,0,360)/2
				G2.Rotation = math.clamp(PercentNumber,0,360)/2
			end
		elseif script.StarterPoint.Value == "Down" then
			if script.Direction.Value == "Left" then
				G1.Rotation = math.clamp(PercentNumber,180,360) + 180
				G2.Rotation = math.clamp(PercentNumber,0,180) + 180
			elseif script.Direction.Value == "Right" then
				G1.Rotation = - math.clamp(PercentNumber,0,180)
				G2.Rotation = - math.clamp(PercentNumber,180,360)
			elseif script.Direction.Value == "Middle" then
				G1.Rotation = - math.clamp(PercentNumber,0,360)/2
				G2.Rotation = math.clamp(PercentNumber,0,360)/2 + 180
			end
		end
	elseif script.StarterPoint.Value == "Left" or script.StarterPoint.Value == "Right"  then
		FramePosChanger("Horizontal",script.StarterPoint.Value)
		if script.StarterPoint.Value == "Left" then
			if script.Direction.Value == "Left" then
				G1.Rotation = math.clamp(PercentNumber,180,360) - 90
				G2.Rotation = math.clamp(PercentNumber,0,180) - 90
			elseif script.Direction.Value == "Right" then
				G1.Rotation = 90 - math.clamp(PercentNumber,0,180)
				G2.Rotation = - math.clamp(PercentNumber,180,360) + 90
			elseif script.Direction.Value == "Middle" then
				G1.Rotation = 90 - math.clamp(PercentNumber,0,360)/2
				G2.Rotation = math.clamp(PercentNumber,0,360)/2  - 90
			end
		elseif script.StarterPoint.Value == "Right" then
			if script.Direction.Value == "Left" then
				G1.Rotation = math.clamp(PercentNumber,180,360) + 90
				G2.Rotation = math.clamp(PercentNumber,0,180) + 90
			elseif script.Direction.Value == "Right" then
				G1.Rotation = 270 - math.clamp(PercentNumber,0,180)
				G2.Rotation = - math.clamp(PercentNumber,180,360) + 270
			elseif script.Direction.Value == "Middle" then
				G1.Rotation = 270 - math.clamp(PercentNumber,0,360)/2
				G2.Rotation = math.clamp(PercentNumber,0,360)/2  + 90
			end
		end
	else
		script.StarterPoint.Value = "Up"
		warn("Unknown Type. Only 4 available: “Up”, “Down”, “Left” and “Right”, changing to “Up”.")
	end
	if script.MissingPartType.Value == "Color" then
		I1.UIGradient.Color = ColorSequence.new({ColorSequenceKeypoint.new(0,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.5,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.502,script.ColorOfMissingPart.Value),ColorSequenceKeypoint.new(1,script.ColorOfMissingPart.Value)})
		I2.UIGradient.Color = ColorSequence.new({ColorSequenceKeypoint.new(0,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.5,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.502,script.ColorOfMissingPart.Value),ColorSequenceKeypoint.new(1,script.ColorOfMissingPart.Value)})
		I1.UIGradient.Transparency = NumberSequence.new(0)
		I2.UIGradient.Transparency = NumberSequence.new(0)
	elseif script.MissingPartType.Value == "Trans" then
		I1.UIGradient.Transparency = NumberSequence.new({NumberSequenceKeypoint.new(0,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.5,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.502,script.TransOfMissingPart.Value),NumberSequenceKeypoint.new(1,script.TransOfMissingPart.Value)})
		I2.UIGradient.Transparency = NumberSequence.new({NumberSequenceKeypoint.new(0,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.5,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.502,script.TransOfMissingPart.Value),NumberSequenceKeypoint.new(1,script.TransOfMissingPart.Value)})
		I1.UIGradient.Color = ColorSequence.new(Color3.new(1,1,1))
		I2.UIGradient.Color = ColorSequence.new(Color3.new(1,1,1))
	elseif script.MissingPartType.Value == "TransAndColor" then
		I1.UIGradient.Transparency = NumberSequence.new({NumberSequenceKeypoint.new(0,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.5,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.502,script.TransOfMissingPart.Value),NumberSequenceKeypoint.new(1,script.TransOfMissingPart.Value)})
		I2.UIGradient.Transparency = NumberSequence.new({NumberSequenceKeypoint.new(0,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.5,script.TransOfPercentPart.Value),NumberSequenceKeypoint.new(0.502,script.TransOfMissingPart.Value),NumberSequenceKeypoint.new(1,script.TransOfMissingPart.Value)})
		I1.UIGradient.Color = ColorSequence.new({ColorSequenceKeypoint.new(0,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.5,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.502,script.ColorOfMissingPart.Value),ColorSequenceKeypoint.new(1,script.ColorOfMissingPart.Value)})
		I2.UIGradient.Color = ColorSequence.new({ColorSequenceKeypoint.new(0,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.5,script.ColorOfPercentPart.Value),ColorSequenceKeypoint.new(0.502,script.ColorOfMissingPart.Value),ColorSequenceKeypoint.new(1,script.ColorOfMissingPart.Value)})
	else
		script.MissingPartType.Value = "Trans"
		warn("Unknown Type. Only 3 available: “Trans”, “Color” and “TransAndColor”, changing to “Trans”.")
	end
end

script.Parent:GetPropertyChangedSignal("Value"):Connect(function()
	Progress(script.Parent.Value)
end)

for Numebr , Property in pairs(script:GetChildren()) do
	Property:GetPropertyChangedSignal("Value"):Connect(function()
		Progress(script.Parent.Value)
	end)
end

while wait(0.1) do
	script.Parent.Value = script.Parent.Value + 1
	if script.Parent.Value > 100 then
		script.Parent.Value = 0
	end
end