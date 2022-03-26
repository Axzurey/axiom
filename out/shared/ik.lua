-- Compiled with roblox-ts v1.2.3
local ik = {}
do
	local _container = ik
	-- a: upper arm = .515;
	-- b: lower arm = 1.1031;
	-- shoulderinit = shoulderC0 no changes, same for elbowinit
	local function solveArm(originCFrame, targetPosition, a, b)
		local localized = originCFrame:PointToObjectSpace(targetPosition)
		local localizedUnit = localized.Unit
		local axis = Vector3.new(0, 0, -1):Cross(localizedUnit)
		local angle = math.acos(-localizedUnit.Z)
		local _arg0 = CFrame.fromAxisAngle(axis, angle)
		local plane = originCFrame * _arg0
		local c = localized.Magnitude
		if c < math.max(a, b) - math.min(a, b) then
			local _plane = plane
			local _cFrame = CFrame.new(0, 0, math.max(b, a) - math.min(b - a) - c)
			return { _plane * _cFrame, -(math.pi / 2), math.pi }
		elseif c > a + b then
			local _plane = plane
			local _cFrame = CFrame.new(0, 0, a + b - c)
			return { _plane * _cFrame, math.pi / 2, 0 }
		else
			local t1 = -math.acos((-(b * b) + (a * a) + (c * c)) / (2 * a * c))
			local t2 = math.acos(((bit32.bxor(b, b)) - (a * a) + (c * c)) / (2 * b * c))
			return { plane, t1 + math.pi / 2, t2 - t1 }
		end
	end
	local function legTo(character, leg, target, hipOrigin, kneeOrigin)
		local upperTorso = character:WaitForChild("LowerTorso")
		local upperLeg = character:WaitForChild(leg .. "UpperLeg")
		local lowerLeg = character:WaitForChild(leg .. "LowerLeg")
		local hip = upperLeg:WaitForChild(leg .. "Hip")
		local knee = lowerLeg:WaitForChild(leg .. "Knee")
		local hipcf = upperTorso.CFrame * hipOrigin
		local _binding = solveArm(hipcf, target, .515, 1.015)
		local plane = _binding[1]
		local hipAngle = _binding[2]
		local kneeAngle = _binding[3]
		local _exp = upperTorso.CFrame:ToObjectSpace(plane)
		local _arg0 = CFrame.Angles(hipAngle, 0, 0)
		hip.C0 = _exp * _arg0
		local _arg0_1 = CFrame.Angles(kneeAngle, 0, 0)
		knee.C0 = kneeOrigin * _arg0_1
	end
	_container.legTo = legTo
end
return ik
